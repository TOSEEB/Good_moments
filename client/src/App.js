import React from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';

import PostDetails from './components/PostDetails/PostDetails';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import SetPassword from './components/Auth/SetPassword';
import CreatorOrTag from './components/CreatorOrTag/CreatorOrTag';

// React Scripts injects process.env variables at build time
// REACT_APP_ prefix variables are automatically available
// Safely access process.env to avoid "process is not defined" errors
const GOOGLE_CLIENT_ID = typeof process !== 'undefined' && process.env ? process.env.REACT_APP_GOOGLE_CLIENT_ID : undefined;

if (!GOOGLE_CLIENT_ID) {
  // REACT_APP_GOOGLE_CLIENT_ID is not defined in environment variables
}

const App = () => {
  const user = useSelector((state) => state.auth.authData);
  
  // Also check localStorage as fallback (in case Redux state hasn't updated yet)
  const checkLocalStorage = () => {
    try {
      const profile = localStorage.getItem('profile');
      if (profile) {
        const parsed = JSON.parse(profile);
        // The profile structure is { result: {...}, token: '...' }
        // So we return parsed.result if it exists, or parsed itself
        const result = parsed?.result || parsed || null;
        return result;
      }
      return null;
    } catch (error) {
      return null;
    }
  };
  
  const userFromLocalStorage = checkLocalStorage();
  
  // Check if user exists in Redux OR if we have a result in localStorage
  // The localStorage structure is: { result: {...}, token: '...' }
  // Redux state structure is: { authData: { result: {...}, token: '...' } }
  const hasUserInRedux = user?.result || user;
  const hasUserInLocalStorage = userFromLocalStorage;
  const isAuthenticated = hasUserInRedux || hasUserInLocalStorage;

  if (!GOOGLE_CLIENT_ID) {
    return (
      <Container maxWidth="xl">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Configuration Error</h2>
          <p>REACT_APP_GOOGLE_CLIENT_ID is not set in your .env file.</p>
          <p>Please check your client/.env file and restart the dev server.</p>
        </div>
      </Container>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Container maxWidth="xl">
          <Navbar />
          <Switch>
            <Route path="/" exact component={() => (!isAuthenticated ? <Redirect to="/auth" /> : <Redirect to="/posts" />)} />
            <Route path="/posts" exact component={() => (!isAuthenticated ? <Redirect to="/auth" /> : <Home />)} />
            <Route path="/posts/search" exact component={() => (!isAuthenticated ? <Redirect to="/auth" /> : <Home />)} />
            <Route path="/posts/:id" exact component={() => (!isAuthenticated ? <Redirect to="/auth" /> : <PostDetails />)} />
            <Route path={['/creators/:name', '/tags/:name']} component={() => (!isAuthenticated ? <Redirect to="/auth" /> : <CreatorOrTag />)} />
            <Route path="/auth/set-password" exact component={SetPassword} />
            <Route path="/auth/reset-password" exact component={SetPassword} />
            <Route path="/auth" exact component={() => (!isAuthenticated ? <Auth /> : <Redirect to="/posts" />)} />
          </Switch>
        </Container>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
