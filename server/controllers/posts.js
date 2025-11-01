import express from 'express';
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';

const router = express.Router();

export const getPosts = async (req, res) => {
    const { page } = req.query;
    
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    
        const total = await PostMessage.countDocuments({});
        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        // Decode tags if URL encoded (handles %23 for #)
        // Important: When # is in a URL query parameter, it might be stripped by the browser
        // So we need to handle both cases: encoded (%23) and raw (#)
        let decodedTags = tags;
        if (tags && typeof tags === 'string') {
            try {
                // First try to decode (handles %23 -> #)
                decodedTags = decodeURIComponent(tags);
            } catch (e) {
                // If decoding fails, use original
                decodedTags = tags;
            }
        }
        
        // Handle empty tags properly and normalize them (add # prefix if missing)
        let tagsArray = [];
        if (decodedTags && decodedTags.trim() !== '') {
            tagsArray = decodedTags.split(',')
                .map(tag => tag.trim())
                .filter(tag => tag !== '')
                .map(tag => {
                    // Normalize tag: ensure it starts with #
                    // After decodeURIComponent, %23 should already be converted to #
                    // But handle edge cases where # might have been stripped by browser
                    let cleanTag = tag;
                    // Replace %23 with # if it still exists (double encoding edge case)
                    if (cleanTag.startsWith('%23')) {
                        cleanTag = '#' + cleanTag.substring(3);
                    }
                    // Ensure tag starts with #
                    if (!cleanTag.startsWith('#')) {
                        cleanTag = '#' + cleanTag;
                    }
                    return cleanTag;
                });
        }
        
        // Check if we should search by title (only if searchQuery exists and is not 'none')
        const shouldSearchTitle = searchQuery && searchQuery !== 'none' && searchQuery.trim() !== '';
        const title = shouldSearchTitle ? new RegExp(searchQuery, "i") : null;
        
        let query = {};
        
        if (shouldSearchTitle && tagsArray.length > 0) {
            // Search by both title and tags (OR condition - matches title OR tags)
            query = { $or: [ { title }, { tags: { $in: tagsArray } } ] };
        } else if (shouldSearchTitle) {
            // Search by title only
            query = { title };
        } else if (tagsArray.length > 0) {
            // Search by tags only - post must have at least one matching tag in its tags array
            // Use exact match with $in operator
            query = { tags: { $in: tagsArray } };
        } else {
            // No search criteria, return all posts
            query = {};
        }

        const posts = await PostMessage.find(query);

        res.json({ data: posts });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPostsByCreator = async (req, res) => {
    const { name } = req.query;

    try {
        const posts = await PostMessage.find({ name });

        res.json({ data: posts });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const createPost = async (req, res) => {
    const post = req.body;

    const newPostMessage = new PostMessage({ 
        ...post, 
        creator: req.userId, 
        name: req.userName,
        createdAt: new Date().toISOString() 
    })

    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    if (!req.userId) {
        return res.status(401).json({ message: "Unauthenticated" });
    }

    const post = await PostMessage.findById(id);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the creator of the post (same access privilege for both login methods)
    if (String(post.creator) !== String(req.userId)) {
        return res.status(403).json({ message: "Unauthorized - You can only update your own posts" });
    }

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    if (!req.userId) {
        return res.status(401).json({ message: "Unauthenticated" });
    }

    const post = await PostMessage.findById(id);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the creator of the post (same access privilege for both login methods)
    if (String(post.creator) !== String(req.userId)) {
        return res.status(403).json({ message: "Unauthorized - You can only delete your own posts" });
    }

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const post = await PostMessage.findById(id);

    // Initialize likes array if it doesn't exist
    if (!post.likes) {
        post.likes = [];
    }

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.status(200).json(updatedPost);
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    if (!req.userId) {
        return res.status(401).json({ message: "Unauthenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessage.findById(id);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    // Initialize comments array if it doesn't exist
    if (!post.comments) {
        post.comments = [];
    }

    // Add comment with user info for consistent access
    const comment = {
        comment: value,
        user: req.userName || 'Anonymous',
        userId: req.userId,
        createdAt: new Date().toISOString()
    };

    post.comments.push(comment);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
};

export default router;