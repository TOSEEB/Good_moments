import React, { useEffect, useState } from 'react';
import { Paper, Typography, CircularProgress, Divider } from '@material-ui/core/';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useHistory, Link, Redirect } from 'react-router-dom';

import { getPost, getPostsBySearch } from '../../actions/posts';
import CommentSection from './CommentSection';
import useStyles from './styles';

const Post = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const { id } = useParams();
  
  // Try to get post from Redux state immediately (from list)
  const postFromList = posts?.find((p) => p._id === id);
  
  // Try to get cached post from sessionStorage for instant display
  const [cachedPost, setCachedPost] = useState(() => {
    try {
      const cached = sessionStorage.getItem(`post_${id}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Only use cache if it's less than 10 minutes old
        if (Date.now() - parsed.timestamp < 10 * 60 * 1000) {
          return parsed.post;
        }
      }
    } catch (error) {
      // Ignore cache errors
    }
    return null;
  });
  
  // Use cached post or post from list or Redux post (priority order)
  const displayPost = post || cachedPost || postFromList;
  
  // Get user from localStorage - use useState with lazy initialization to prevent re-renders
  const [user, setUser] = useState(() => {
    try {
      const profile = localStorage.getItem('profile');
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      return null;
    }
  });

  // Extract user result to avoid complex expression in dependency arrays
  const userResult = user?.result;

  // Update user from localStorage when component mounts
  useEffect(() => {
    try {
      const profile = localStorage.getItem('profile');
      if (profile) {
        const parsed = JSON.parse(profile);
        setUser(parsed);
      }
    } catch (error) {
      // Error reading profile
    }
  }, []);

  // Load fresh post data in background (don't block UI if we have cached/list post)
  useEffect(() => {
    if (userResult) {
      // If we already have post from cache/list, load fresh data in background
      if (displayPost) {
        // Small delay to show cached post first
        setTimeout(() => {
          dispatch(getPost(id));
        }, 50);
      } else {
        // No cached post, load immediately
        dispatch(getPost(id));
      }
    }
  }, [id, dispatch, userResult]);

  // Load related posts AFTER showing main post (don't block UI)
  useEffect(() => {
    if (userResult && displayPost && displayPost.tags) {
      // Load related posts in background after main post is displayed
      // Delay to prioritize main post display - only load after post is shown
      setTimeout(() => {
        dispatch(getPostsBySearch({ search: 'none', tags: displayPost.tags.join(',') }));
      }, 500); // Longer delay to ensure main post is fully displayed
    }
  }, [displayPost, dispatch, userResult]);

  // Redirect to auth if not logged in (after hooks)
  if (!userResult) {
    return <Redirect to="/auth" />;
  }

  if (!post && !isLoading) {
    return null;
  }

  const openPost = (_id) => history.push(`/posts/${_id}`);

  // Show loading only if we don't have any post (not from cache, list, or Redux)
  if (isLoading && !displayPost) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }
  
  // If no post found after loading
  if (!displayPost && !isLoading) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <Typography variant="h6">Post not found</Typography>
      </Paper>
    );
  }

  const recommendedPosts = posts.filter(({ _id }) => _id !== displayPost._id);

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <div className={classes.card}>
        {/* Image first on mobile */}
        <div className={classes.imageSection}>
          <img className={classes.media} src={displayPost.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={displayPost.title} />
        </div>
        {/* Description and tags, then comments below on mobile */}
        <div className={classes.section}>
          <Typography variant="h3" component="h2">{displayPost.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{displayPost.tags?.map((tag, index) => {
            // Remove # from tag for URL (URL path can't have #)
            const tagForUrl = tag.startsWith('#') ? tag.substring(1) : tag;
            return (
              <Link key={index} to={`/tags/${encodeURIComponent(tagForUrl)}`} style={{ textDecoration: 'none', color: '#3f51b5' }}>
                {` #${tag} `}
              </Link>
            );
          })}
          </Typography>
          <Typography gutterBottom variant="body1" component="p">{displayPost.message}</Typography>
          <Typography variant="h6">
            Created by:
            <Link to={`/creators/${displayPost.name}`} style={{ textDecoration: 'none', color: '#3f51b5' }}>
              {` ${displayPost.name}`}
            </Link>
          </Typography>
          <Typography variant="body1">{moment(displayPost.createdAt).fromNow()}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="body1"><strong>Realtime Chat - coming soon!</strong></Typography>
          <Divider style={{ margin: '20px 0' }} />
          <CommentSection post={displayPost || post} />
          <Divider style={{ margin: '20px 0' }} />
        </div>
      </div>
      {!!recommendedPosts.length && (
        <div className={classes.section}>
          <Typography gutterBottom variant="h5">You might also like:</Typography>
          <Divider />
          <div className={classes.recommendedPosts}>
            {recommendedPosts.map(({ title, name, message, likes, selectedFile, _id }) => (
              <div className={classes.recommendedPost} onClick={() => openPost(_id)} key={_id}>
                <div>
                  <Typography className={classes.recommendedTitle}>{title}</Typography>
                  <Typography className={classes.recommendedAuthor}>{name}</Typography>
                  <Typography className={classes.recommendedMessage}>{message}</Typography>
                  <Typography className={classes.recommendedLikes}>Likes: {likes.length}</Typography>
                </div>
                <img 
                  className={classes.recommendedImage}
                  src={selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} 
                  alt={`${title} by ${name}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </Paper>
  );
};

export default Post;
