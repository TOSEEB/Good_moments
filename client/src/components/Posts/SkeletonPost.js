import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import useStyles from './styles';

const SkeletonPost = () => {
  const classes = useStyles();

  return (
    <Card className={classes.card} elevation={6}>
      <Skeleton variant="rect" width="100%" height={200} />
      <CardContent>
        <Skeleton variant="text" width="80%" height={24} style={{ marginBottom: 10 }} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="60%" height={20} />
      </CardContent>
      <CardActions disableSpacing className={classes.cardActions}>
        <Skeleton variant="circular" width={32} height={32} style={{ marginRight: 10 }} />
        <Skeleton variant="text" width={60} height={24} />
      </CardActions>
    </Card>
  );
};

export default SkeletonPost;

