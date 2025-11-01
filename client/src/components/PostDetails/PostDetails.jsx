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

  useEffect(() => {
    if (userResult) {
      dispatch(getPost(id));
    }
  }, [id, dispatch, userResult]);

  useEffect(() => {
    if (userResult && post && post.tags) {
      dispatch(getPostsBySearch({ search: 'none', tags: post.tags.join(',') }));
    }
  }, [post, dispatch, userResult]);

  // Redirect to auth if not logged in (after hooks)
  if (!userResult) {
    return <Redirect to="/auth" />;
  }

  if (!post && !isLoading) {
    return null;
  }

  const openPost = (_id) => history.push(`/posts/${_id}`);

  if (isLoading) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">{post.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag, index) => {
            // Remove # from tag for URL (URL path can't have #)
            const tagForUrl = tag.startsWith('#') ? tag.substring(1) : tag;
            return (
              <Link key={index} to={`/tags/${encodeURIComponent(tagForUrl)}`} style={{ textDecoration: 'none', color: '#3f51b5' }}>
                {` #${tag} `}
              </Link>
            );
          })}
          </Typography>
          <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
          <Typography variant="h6">
            Created by:
            <Link to={`/creators/${post.name}`} style={{ textDecoration: 'none', color: '#3f51b5' }}>
              {` ${post.name}`}
            </Link>
          </Typography>
          <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="body1"><strong>Realtime Chat - coming soon!</strong></Typography>
          <Divider style={{ margin: '20px 0' }} />
          <CommentSection post={post} />
          <Divider style={{ margin: '20px 0' }} />
        </div>
        <div className={classes.imageSection}>
          <img className={classes.media} src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
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
