import React, { useState, useRef } from 'react';
import { Typography, TextField, Button } from '@material-ui/core/';
import { useDispatch } from 'react-redux';

import { commentPost } from '../../actions/posts';
import useStyles from './styles';

const CommentSection = ({ post }) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const [comments, setComments] = useState(post?.comments);
  const classes = useStyles();
  const commentsRef = useRef();

  const handleComment = async () => {
    try {
      // Send just the comment text - backend will add user info
      const newComments = await dispatch(commentPost(comment, post._id));

      if (newComments) {
        setComment('');
        setComments(newComments);
        commentsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      // Handle error - don't clear comment if it's an auth error
      if (error.response?.status === 401) {
        alert('Your session has expired. Please refresh the page and sign in again.');
      } else {
        console.error('Error posting comment:', error);
        alert('Failed to post comment. Please try again.');
      }
    }
  };

  return (
    <div>
      <div className={classes.commentsOuterContainer}>
        <div className={classes.commentsInnerContainer}>
          <Typography gutterBottom variant="h6">Comments</Typography>
          {comments?.map((c, i) => {
            // Handle both old string format and new object format
            let userName, commentText;
            if (typeof c === 'string') {
              // Old format: "Name: comment"
              const parts = c.split(': ');
              userName = parts[0];
              commentText = parts.slice(1).join(': ');
            } else {
              // New format: { user, comment, userId, createdAt }
              userName = c.user || 'Anonymous';
              commentText = c.comment || c;
            }
            return (
              <Typography key={i} gutterBottom variant="subtitle1">
                <strong>{userName}:</strong> {commentText}
              </Typography>
            );
          })}
          <div ref={commentsRef} />
        </div>
        <div style={{ width: '70%' }}>
          <Typography gutterBottom variant="h6">Write a comment</Typography>
          <TextField fullWidth minRows={4} variant="outlined" label="Comment" multiline value={comment} onChange={(e) => setComment(e.target.value)} />
          <br />
          <Button style={{ marginTop: '10px' }} fullWidth disabled={!comment.length} color="primary" variant="contained" onClick={handleComment}>
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
