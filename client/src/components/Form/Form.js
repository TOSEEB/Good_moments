import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, Typography, Paper, CircularProgress } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { useHistory } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';

import { createPost, updatePost } from '../../actions/posts';
import { compressImage } from '../../utils/imageCompress';
import useStyles from './styles';

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({ title: '', message: '', tags: [], selectedFile: '' });
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const post = useSelector((state) => (currentId ? state.posts.posts.find((message) => message._id === currentId) : null));
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  const history = useHistory();

  const clear = useCallback(() => {
    setCurrentId(0);
    setPostData({ title: '', message: '', tags: [], selectedFile: '' });
  }, [setCurrentId]);

  useEffect(() => {
    if (currentId === 0) {
      setPostData({ title: '', message: '', tags: [], selectedFile: '' });
    } else if (post) {
      setPostData(post);
    }
  }, [currentId, post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);
    
    try {
      if (currentId === 0) {
        await dispatch(createPost({ ...postData, name: user?.result?.name }, history));
        clear();
      } else {
        await dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
        clear();
      }
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFileUpload = async (result) => {
    // react-file-base64 returns { base64, file } or just { base64 }
    const { base64, file } = result;
    
    if (file && file.size > 0) {
      setIsCompressing(true);
      try {
        // Compress image before converting to base64
        const compressedBase64 = await compressImage(file);
        setPostData({ ...postData, selectedFile: compressedBase64 });
      } catch (error) {
        console.error('Error compressing image:', error);
        // Fallback to original if compression fails
        setPostData({ ...postData, selectedFile: base64 });
      } finally {
        setIsCompressing(false);
      }
    } else {
      // If no file object, use the base64 directly (fallback)
      setPostData({ ...postData, selectedFile: base64 });
    }
  };

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper} elevation={6}>
        <Typography variant="h6" align="center">
          Please Sign In to create your own memories and like other's memories.
        </Typography>
      </Paper>
    );
  }

  const handleAddChip = (tag) => {
    // Ensure tag starts with # if not already present
    const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
    setPostData({ ...postData, tags: [...postData.tags, formattedTag] });
  };

  const handleDeleteChip = (chipToDelete) => {
    setPostData({ ...postData, tags: postData.tags.filter((tag) => tag !== chipToDelete) });
  };

  return (
    <Paper className={classes.paper} elevation={6}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{currentId ? `Editing "${post?.title}"` : 'Creating a Memory'}</Typography>
        <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
        <TextField name="message" variant="outlined" label="Message" fullWidth multiline minRows={4} value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value })} />
        <div style={{ padding: '5px 0', width: '94%' }}>
          <ChipInput
            name="tags"
            variant="outlined"
            label="Tags"
            fullWidth
            value={postData.tags}
            onAdd={(chip) => handleAddChip(chip)}
            onDelete={(chip) => handleDeleteChip(chip)}
          />
        </div>
        <div className={classes.fileInput}>
          <FileBase 
            type="file" 
            multiple={false} 
            onDone={handleFileUpload}
            disabled={isCompressing}
          />
          {isCompressing && (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <CircularProgress size={20} style={{ marginRight: '10px' }} />
              <Typography variant="body2" color="textSecondary">
                Compressing image...
              </Typography>
            </div>
          )}
        </div>
        <Button 
          className={classes.buttonSubmit} 
          variant="contained" 
          color="primary" 
          size="large" 
          type="submit" 
          fullWidth
          disabled={isSubmitting || isCompressing}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={20} style={{ marginRight: '10px', color: 'white' }} />
              Uploading...
            </>
          ) : (
            'Submit'
          )}
        </Button>
        <Button 
          className={classes.buttonClear}
          variant="contained" 
          size="small" 
          onClick={clear} 
          fullWidth
          disabled={isSubmitting || isCompressing}
        >
          Clear
        </Button>
      </form>
    </Paper>
  );
};

export default Form;
