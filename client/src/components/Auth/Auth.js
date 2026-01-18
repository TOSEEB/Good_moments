import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Button, Paper, Grid, Typography, Container, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import Icon from './icon';
import { signin, signup } from '../../actions/auth';
import { AUTH } from '../../constants/actionTypes';
import useStyles from './styles';
import Input from './Input';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const SignUp = () => {
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Forgot password modal state
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  const switchMode = () => {
    setForm(initialState);
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
    setNeedsPassword(false);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setNeedsPassword(false);

    if (isSignup) {
      setIsLoading(true);
      try {
        await dispatch(signup(form, history));
      } catch (error) {
        setIsLoading(false);
        setErrorMessage(error.response?.data?.message || 'Failed to sign up. Please try again.');
      }
    } else {
      setIsLoading(true);
      try {
        const result = await dispatch(signin(form, history));
        
        // Check if user needs to set password (email sent)
        if (result && result.needsPassword) {
          setIsLoading(false);
          setNeedsPassword(true);
          return;
        }
        // If successful, signin action will redirect
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        
        // Check if error response indicates password needs to be set (email sent)
        if (error.response?.data?.needsPassword) {
          setNeedsPassword(true);
        } else {
          setErrorMessage(error.response?.data?.message || 'Failed to sign in. Please check your credentials.');
        }
      }
    }
  };

  const handleOpenForgotPassword = () => {
    setForgotPasswordOpen(true);
    setForgotPasswordEmail(form.email || ''); // Pre-fill with email if available
    setForgotPasswordError('');
    setForgotPasswordSuccess(false);
  };

  const handleCloseForgotPassword = () => {
    setForgotPasswordOpen(false);
    setForgotPasswordEmail('');
    setForgotPasswordError('');
    setForgotPasswordSuccess(false);
  };

  const handleRequestPasswordEmail = async () => {
    if (!forgotPasswordEmail || !forgotPasswordEmail.trim()) {
      setForgotPasswordError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordEmail.trim())) {
      setForgotPasswordError('Please enter a valid email address');
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError('');
    setForgotPasswordSuccess(false);

    try {
      const API_BASE_URL = typeof process !== 'undefined' && process.env ? process.env.REACT_APP_API_URL : undefined;
      
      if (!API_BASE_URL) {
        throw new Error('API URL not configured');
      }

      // Use forgot-password endpoint which handles both password reset and password setup
      const response = await fetch(`${API_BASE_URL}/user/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if it's a user not found error
        if (response.status === 404 || data.message?.toLowerCase().includes('doesn\'t exist') || data.message?.toLowerCase().includes('user not found')) {
          setForgotPasswordError('Email does not exist in our system. Please check your email address or sign up first.');
        } else {
          throw new Error(data.message || 'Failed to send email. Please try again.');
        }
        return;
      }

      // Success - email sent
      setForgotPasswordSuccess(true);
      setForgotPasswordError('');
    } catch (error) {
      setForgotPasswordError(error.message || 'Failed to send email. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const googleErrorHandler = (error) => {
    // Google Sign In was unsuccessful
    console.error('Google OAuth error:', error);
    setErrorMessage(error?.error_description || error?.message || 'Google sign-in failed. Please try again.');
    setIsLoading(false);
  };

  const googleSuccess = async (codeResponse) => {
    try {
      if (!codeResponse) {
        throw new Error('Invalid response from Google');
      }
      
      if (!codeResponse.access_token) {
        throw new Error('Invalid response from Google - no access token');
      }

      // Get user info from Google using the access token
      const googleResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${codeResponse.access_token}`,
        },
      });
      
      if (!googleResponse.ok) {
        throw new Error(`Google API error: ${googleResponse.status}`);
      }
      
      const userInfo = await googleResponse.json();
      
      if (!userInfo || !userInfo.id || !userInfo.email) {
        throw new Error('Invalid user info from Google');
      }
      
      // Call our backend to authenticate/link account
      const API_BASE_URL = typeof process !== 'undefined' && process.env ? process.env.REACT_APP_API_URL : undefined;
      
      if (!API_BASE_URL) {
        throw new Error('API URL not configured');
      }
      
      const apiUrl = `${API_BASE_URL}/user/google`;
      console.log('Calling API:', apiUrl);
      
      const authResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userInfo.email,
          googleId: userInfo.id,
          name: userInfo.name,
          picture: userInfo.picture
        }),
      });
      
      if (!authResponse.ok) {
        const errorText = await authResponse.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText || `HTTP ${authResponse.status}: ${authResponse.statusText}` };
        }
        console.error('API Error:', authResponse.status, errorData);
        console.error('Full error response:', errorText);
        console.error('Response headers:', Object.fromEntries(authResponse.headers.entries()));
        // Log the full error details to help debug
        throw new Error(errorData.message || `Authentication failed (${authResponse.status})`);
      }
      
      const authData = await authResponse.json();
      
      // Store both the JWT token and Google info for compatibility
      const profileData = {
        result: {
          ...authData.result,
          googleId: userInfo.id,
          picture: userInfo.picture
        },
        token: authData.token // JWT token from our backend
      };
      
      // Save to localStorage immediately - use synchronous method for instant save
      localStorage.setItem('profile', JSON.stringify(profileData));
      
      // Update Redux store IMMEDIATELY (synchronous) - no async operations
      dispatch({ type: AUTH, data: profileData });
      
      // Use React Router push for INSTANT navigation (no page reload = much faster!)
      // This is 100x faster than window.location.href because it doesn't reload the entire page
      history.push('/posts');

      return;
      
    } catch (error) {
      console.error('Google OAuth flow error:', error);
      setErrorMessage(error.message || 'Authentication failed. Please try again.');
      setIsLoading(false);
      googleErrorHandler(error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: googleSuccess,
    onError: googleErrorHandler,
    flow: 'implicit',
    select_account: true,
    ux_mode: 'redirect', // Using redirect mode to completely avoid COOP/window.closed issues
  });

  // Handle redirect callback when user returns from Google
  useEffect(() => {
    // The useGoogleLogin hook with redirect mode automatically handles the callback
    // when the component mounts after redirect, so we don't need extra logic here
    // The onSuccess callback will be triggered automatically
  }, []);

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setIsLoading(true);
      login();
    } catch (error) {
      setIsLoading(false);
      googleErrorHandler(error);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={6}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          { needsPassword ? 'Email Sent!' : (isSignup ? 'Sign up' : 'Sign in') }
        </Typography>
        {errorMessage && !needsPassword && (
          <Typography 
            variant="body2" 
            color="error" 
            style={{ marginBottom: '10px', textAlign: 'center', padding: '10px', wordWrap: 'break-word' }}
          >
            {errorMessage}
          </Typography>
        )}
        {!needsPassword ? (
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              { isSignup && (
              <>
                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                <Input name="lastName" label="Last Name" handleChange={handleChange} half />
              </>
              )}
              <Input 
                name="email" 
                label="Email Address" 
                handleChange={handleChange} 
                type="email" 
                autoFocus={!isSignup}
              />
              <Input 
                name="password" 
                label="Password" 
                handleChange={handleChange} 
                type={showPassword ? 'text' : 'password'} 
                handleShowPassword={handleShowPassword}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(e);
                  }
                }}
              />
              { isSignup && (
                <Input 
                  name="confirmPassword" 
                  label="Repeat Password" 
                  handleChange={handleChange} 
                  type="password"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit(e);
                    }
                  }}
                />
              )}
            </Grid>
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              color="primary" 
              className={classes.submit}
              disabled={isLoading}
            >
              { isLoading ? 'Loading...' : (isSignup ? 'Sign Up' : 'Sign In') }
            </Button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 10px' }}>
            <Typography variant="h6" style={{ marginBottom: '15px', color: '#1976d2' }}>
              ✓ Email Sent Successfully!
            </Typography>
            <Typography variant="body1" style={{ marginBottom: '15px', fontWeight: 500 }}>
              Check your inbox: <span style={{ color: '#1976d2' }}>{form.email}</span>
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: '25px', lineHeight: 1.6 }}>
              We've sent you an email with a link to reset/set your password. 
              Click the link in the email to continue. The link will expire in 1 hour.
            </Typography>
            <Button 
              fullWidth 
              variant="outlined" 
              color="primary"
              onClick={() => {
                setNeedsPassword(false);
                setErrorMessage('');
              }}
              style={{ marginBottom: '10px' }}
            >
              Back to Sign In
            </Button>
            <Button 
              fullWidth 
              variant="text" 
              color="primary"
              onClick={handleRequestPasswordEmail}
              disabled={isLoading}
              style={{ textTransform: 'none' }}
            >
              {isLoading ? 'Sending...' : 'Didn\'t receive the email? Resend'}
            </Button>
          </div>
        )}
        {!needsPassword && (
          <>
            <Button 
              className={classes.googleButton} 
              fullWidth 
              onClick={handleGoogleLogin}
              startIcon={<Icon />} 
              variant="outlined"
            >
              Sign in with Google
            </Button>
          </>
        )}
        <div className={classes.footerLinks}>
          {!isSignup && !needsPassword && (
            <Typography 
              variant="body2" 
              className={classes.linkText}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleOpenForgotPassword();
              }}
            >
              Forgot password?
            </Typography>
          )}
          <Typography 
            variant="body2" 
            className={classes.signUpLink}
            onClick={switchMode}
            style={{ cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1 }}
          >
            { isSignup ? 'Already have an account? ' : "Don't have an account? " }
            <span className={classes.linkSpan}>
              { isSignup ? 'Sign in' : 'Sign up' }
            </span>
          </Typography>
        </div>
      </Paper>

      {/* Forgot Password Modal */}
      <Dialog 
        open={forgotPasswordOpen} 
        onClose={handleCloseForgotPassword}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Forgot Password / Set Password</DialogTitle>
        <DialogContent>
          {forgotPasswordSuccess ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Typography variant="h6" style={{ marginBottom: '15px', color: '#1976d2' }}>
                ✓ Email Sent Successfully!
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '10px', fontWeight: 500 }}>
                Check your inbox: <span style={{ color: '#1976d2' }}>{forgotPasswordEmail}</span>
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ lineHeight: 1.6 }}>
                We've sent you an email with a link to reset/set your password. 
                Click the link in the email to continue. The link will expire in 1 hour.
              </Typography>
            </div>
          ) : (
            <>
              <Typography variant="body2" color="textSecondary" style={{ marginBottom: '20px' }}>
                Enter your email address and we'll send you a link to reset or set your password.
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={forgotPasswordEmail}
                onChange={(e) => {
                  setForgotPasswordEmail(e.target.value);
                  setForgotPasswordError('');
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !forgotPasswordLoading) {
                    handleRequestPasswordEmail();
                  }
                }}
                error={!!forgotPasswordError}
                helperText={forgotPasswordError || ' '}
                disabled={forgotPasswordLoading}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          {forgotPasswordSuccess ? (
            <Button onClick={handleCloseForgotPassword} color="primary" variant="contained" fullWidth>
              Close
            </Button>
          ) : (
            <>
              <Button onClick={handleCloseForgotPassword} color="secondary" disabled={forgotPasswordLoading}>
                Cancel
              </Button>
              <Button 
                onClick={handleRequestPasswordEmail} 
                color="primary" 
                variant="contained"
                disabled={forgotPasswordLoading || !forgotPasswordEmail.trim()}
              >
                {forgotPasswordLoading ? (
                  <>
                    <CircularProgress size={20} style={{ marginRight: 10 }} />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SignUp;
