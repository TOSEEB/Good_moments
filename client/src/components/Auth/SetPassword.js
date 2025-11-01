import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Button, Paper, Grid, Typography, Container, CircularProgress } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { setPasswordForGoogleUser } from '../../actions/auth';
import useStyles from './styles';
import Input from './Input';

const SetPassword = () => {
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();

  useEffect(() => {
    // Get token and email from URL query parameters
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    const urlEmail = params.get('email');

    if (!urlToken || !urlEmail) {
      setErrorMessage('Invalid or missing verification link. Please request a new password setup email.');
      return;
    }

    // Store token and email in state
    setToken(urlToken);
    setEmail(decodeURIComponent(urlEmail));
    
    // Security: Clear sensitive data from URL after reading (prevents exposure in browser history)
    // Replace URL without token/email parameters to hide sensitive information
    const newUrl = `${window.location.pathname}`;
    window.history.replaceState({}, document.title, newUrl);
  }, [location]);

  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!form.password || !form.confirmPassword) {
      setErrorMessage('Please enter and confirm your password');
      return;
    }

    if (form.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (!token || !email) {
      setErrorMessage('Invalid verification link. Please request a new password setup email.');
      return;
    }

    setIsLoading(true);
    try {
      const API_BASE_URL = typeof process !== 'undefined' && process.env ? process.env.REACT_APP_API_URL : undefined;
      
      if (!API_BASE_URL) {
        throw new Error('API URL not configured');
      }

      const response = await fetch(`${API_BASE_URL}/user/verify-token-set-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password: form.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to set password. Please try again.');
      }

      // Password set successfully - save to localStorage and redirect
      const profileData = {
        result: data.result,
        token: data.token
      };
      
      localStorage.setItem('profile', JSON.stringify(profileData));
      
      setSuccessMessage('Password set successfully! Redirecting...');
      
      // Redirect to posts page
      setTimeout(() => {
        window.location.href = '/posts';
      }, 1500);

    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message || 'Failed to set password. Please try again.');
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (!token || !email) {
    return (
      <Container component="main" maxWidth="xs">
        <Paper className={classes.paper} elevation={6}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">Set Password</Typography>
          <Typography variant="body2" color="error" style={{ marginTop: '20px', textAlign: 'center', padding: '10px' }}>
            {errorMessage || 'Invalid verification link. Please check your email and use the link provided.'}
          </Typography>
          <Button 
            fullWidth 
            variant="outlined" 
            color="primary" 
            onClick={() => history.push('/auth')}
            style={{ marginTop: '20px' }}
          >
            Go to Sign In
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={6}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">Set Password</Typography>
        <Typography variant="body2" style={{ marginTop: '10px', textAlign: 'center', padding: '10px', color: '#666' }}>
          For: {email}
        </Typography>
        <Typography variant="caption" style={{ display: 'block', marginTop: '5px', textAlign: 'center', padding: '5px', color: '#999', fontSize: '0.75rem' }}>
          ⚠️ For security, please don't share this page. Link expires in 1 hour.
        </Typography>
        {successMessage && (
          <Typography variant="body2" color="primary" style={{ marginTop: '10px', textAlign: 'center', padding: '10px' }}>
            {successMessage}
          </Typography>
        )}
        {errorMessage && (
          <Typography variant="body2" color="error" style={{ marginTop: '10px', textAlign: 'center', padding: '10px' }}>
            {errorMessage}
          </Typography>
        )}
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Input 
              name="password" 
              label="Password" 
              handleChange={handleChange} 
              type={showPassword ? 'text' : 'password'} 
              handleShowPassword={handleShowPassword}
              autoFocus
            />
            <Input 
              name="confirmPassword" 
              label="Confirm Password" 
              handleChange={handleChange} 
              type="password"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
            />
          </Grid>
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            color="primary" 
            className={classes.submit}
            disabled={isLoading || !!successMessage}
          >
            {isLoading ? <CircularProgress size={24} /> : (successMessage ? 'Redirecting...' : 'Set Password')}
          </Button>
          <Button 
            type="button"
            fullWidth 
            variant="outlined" 
            color="secondary" 
            onClick={() => history.push('/auth')}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default SetPassword;

