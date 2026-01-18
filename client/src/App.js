import React, { Suspense, lazy, useMemo } from 'react';
import { Container, CircularProgress, ThemeProvider } from '@material-ui/core';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import theme from './theme';

// Lazy load components for code splitting - dramatically reduces initial bundle size
const PostDetails = lazy(() => import('./components/PostDetails/PostDetails'));
const Navbar = lazy(() => import('./components/Navbar/Navbar'));
const Home = lazy(() => import('./components/Home/Home'));
const Auth = lazy(() => import('./components/Auth/Auth'));
const SetPassword = lazy(() => import('./components/Auth/SetPassword'));
const CreatorOrTag = lazy(() => import('./components/CreatorOrTag/CreatorOrTag'));

// Lightweight loading fallback
const LoadingFallback = () => (
  <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <CircularProgress />
  </Container>
);

// React Scripts injects process.env variables at build time
// REACT_APP_ prefix variables are automatically available
// Safely access process.env to avoid "process is not defined" errors
const GOOGLE_CLIENT_ID = typeof process !== 'undefined' && process.env ? process.env.REACT_APP_GOOGLE_CLIENT_ID : undefined;

if (!GOOGLE_CLIENT_ID) {
  // REACT_APP_GOOGLE_CLIENT_ID is not defined in environment variables
}

const App = () => {
  const user = useSelector((state) => state.auth.authData);
  
  // Memoize localStorage check - only run once on mount, cached after that
  const userFromLocalStorage = useMemo(() => {
    try {
      const profile = localStorage.getItem('profile');
      if (profile) {
        const parsed = JSON.parse(profile);
        return parsed?.result || parsed || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  }, []); // Empty deps - only check once on mount
  
  // Memoize authentication check to prevent unnecessary recalculations
  const isAuthenticated = useMemo(() => {
    const hasUserInRedux = user?.result || user;
    return hasUserInRedux || userFromLocalStorage;
  }, [user, userFromLocalStorage]);

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
    <ThemeProvider theme={theme}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Container maxWidth="xl">
              <Suspense fallback={null}>
                <Navbar />
              </Suspense>
              <Switch>
              <Route path="/" exact render={() => (!isAuthenticated ? <Redirect to="/auth" /> : <Redirect to="/posts" />)} />
              <Route path="/posts" exact render={() => (!isAuthenticated ? <Redirect to="/auth" /> : <Home />)} />
              <Route path="/posts/search" exact render={() => (!isAuthenticated ? <Redirect to="/auth" /> : <Home />)} />
              <Route path="/posts/:id" exact render={() => (!isAuthenticated ? <Redirect to="/auth" /> : <PostDetails />)} />
              <Route path={['/creators/:name', '/tags/:name']} render={() => (!isAuthenticated ? <Redirect to="/auth" /> : <CreatorOrTag />)} />
              <Route path="/auth/set-password" exact component={SetPassword} />
              <Route path="/auth/reset-password" exact component={SetPassword} />
              <Route path="/auth" exact render={() => (!isAuthenticated ? <Auth /> : <Redirect to="/posts" />)} />
              </Switch>
            </Container>
          </Suspense>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
};

export default App;
