import React, { useMemo } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useSelector } from 'react-redux';

import Post from './Post/Post';
import useStyles from './styles';

const SkeletonPost = () => (
  <Grid item xs={12} sm={12} md={6} lg={3}>
    <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Skeleton variant="rect" width="100%" height={200} style={{ marginBottom: '16px', borderRadius: '4px' }} />
      <Skeleton variant="text" width="80%" height={28} style={{ marginBottom: '12px' }} />
      <Skeleton variant="text" width="100%" height={20} style={{ marginBottom: '8px' }} />
      <Skeleton variant="text" width="100%" height={20} style={{ marginBottom: '8px' }} />
      <Skeleton variant="text" width="60%" height={20} style={{ marginBottom: '16px' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Skeleton variant="text" width={80} height={24} />
        <Skeleton variant="circular" width={32} height={32} />
      </div>
    </div>
  </Grid>
);

const Posts = ({ setCurrentId }) => {
  const { posts, isLoading } = useSelector((state) => state.posts);
  const classes = useStyles();
  
  // Memoize user check to avoid repeated localStorage reads
  const user = useMemo(() => {
    try {
      const profile = localStorage.getItem('profile');
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      return null;
    }
  }, []);

  if (!user?.result) {
    return (
      <Typography variant="h6" align="center">
        Please sign in to view posts.
      </Typography>
    );
  }

  if (!posts.length && !isLoading) {
    return (
      <Typography variant="h6" align="center" style={{ padding: '20px' }}>
        No posts found. Create your first memory!
      </Typography>
    );
  }

  return (
    <Grid className={classes.container} container alignItems="stretch" spacing={3}>
      {isLoading ? (
        // Show 8 skeleton loaders
        Array.from({ length: 8 }).map((_, index) => <SkeletonPost key={`skeleton-${index}`} />)
      ) : (
        posts?.map((post) => (
          <Grid key={post._id} item xs={12} sm={12} md={6} lg={3}>
            <Post post={post} setCurrentId={setCurrentId} />
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default Posts;
