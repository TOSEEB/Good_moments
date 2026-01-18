import React, { useState, useEffect, useCallback } from 'react';
import { AppBar, Typography, Toolbar, Avatar, Button } from '@material-ui/core';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';

import * as actionType from '../../constants/actionTypes';
import useStyles from './styles';

const Navbar = () => {
  const [user, setUser] = useState(() => {
    try {
      const profile = localStorage.getItem('profile');
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      return null;
    }
  });
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  const logout = useCallback(() => {
    dispatch({ type: actionType.LOGOUT });
    history.push('/auth');
    setUser(null);
  }, [dispatch, history]);

  useEffect(() => {
    try {
      const profile = localStorage.getItem('profile');
      const userData = profile ? JSON.parse(profile) : null;
      setUser(userData);

      const token = userData?.token;

      if (token) {
        try {
          // Check if token is a JWT (custom auth tokens are JWTs, Google OAuth tokens are not)
          // JWT tokens are typically less than 500 characters and have 3 parts separated by dots
          const isJWT = token.length < 500 && token.split('.').length === 3;
          
          if (isJWT) {
            // This is a JWT token (from custom signin/signup)
            const decodedToken = decode(token);
            
            // Check if token is expired
            if (decodedToken.exp && decodedToken.exp * 1000 < new Date().getTime()) {
              logout();
            }
          }
        } catch (decodeError) {
          // If decode fails, it might be a Google OAuth token (not a JWT)
          // Only logout if we're sure it's a JWT that failed
          const isJWT = token.length < 500 && token.split('.').length === 3;
          if (isJWT) {
            logout();
          }
        }
      }
    } catch (error) {
      // Error reading profile
    }
  }, [location, logout]);

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <Link to="/" className={classes.brandContainer}>
        <Typography className={classes.heading} variant="h5">
          Good Moments
        </Typography>
      </Link>
      {user?.result && (
        <Toolbar className={classes.toolbar}>
          <div className={classes.profile}>
            <Avatar className={classes.avatar} alt={user?.result.name} src={user?.result.picture || user?.result.imageUrl}>
              {user?.result.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography className={classes.userName} variant="h6">{user?.result.name}</Typography>
            <Button variant="contained" className={classes.logout} onClick={logout}>Logout</Button>
          </div>
        </Toolbar>
      )}
    </AppBar>
  );
};

export default Navbar;
