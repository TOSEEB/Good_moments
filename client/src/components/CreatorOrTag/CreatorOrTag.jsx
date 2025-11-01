import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Redirect } from 'react-router-dom';
import { Typography, CircularProgress, Grid, Divider } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Post from '../Posts/Post/Post';
import { getPostsByCreator, getPostsBySearch } from '../../actions/posts';

const CreatorOrTag = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const { posts, isLoading } = useSelector((state) => state.posts);
  const location = useLocation();
  
  // Get user from localStorage safely
  const [user, setUser] = useState(() => {
    try {
      const profile = localStorage.getItem('profile');
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      return null;
    }
  });

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

  const userResult = user?.result;

  useEffect(() => {
    if (userResult) {
      if (location.pathname.startsWith('/tags')) {
        // Decode URL parameter and normalize tag (add # if missing)
        // Tags in database have # prefix, so we need to match
        const decodedName = decodeURIComponent(name);
        const normalizedTag = decodedName.startsWith('#') ? decodedName : `#${decodedName}`;
        dispatch(getPostsBySearch({ tags: normalizedTag }));
      } else {
        dispatch(getPostsByCreator(name));
      }
    }
  }, [dispatch, location.pathname, name, userResult]);

  // Redirect to auth if not logged in (after hooks)
  if (!userResult) {
    return <Redirect to="/auth" />;
  }

  if (!posts.length && !isLoading) return 'No posts';

  return (
    <div>
      <Typography variant="h2">{name}</Typography>
      <Divider style={{ margin: '20px 0 50px 0' }} />
      {isLoading ? <CircularProgress /> : (
        <Grid container alignItems="stretch" spacing={3}>
          {posts?.map((post) => (
            <Grid key={post._id} item xs={12} sm={12} md={6} lg={3}>
              <Post post={post} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default CreatorOrTag;
