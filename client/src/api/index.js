import axios from 'axios';

// React Scripts injects process.env variables at build time
// Access them safely
const API_BASE_URL = typeof process !== 'undefined' && process.env ? process.env.REACT_APP_API_URL : undefined;

if (!API_BASE_URL) {
  throw new Error('REACT_APP_API_URL is required. Please add it to your .env file.');
}

const API = axios.create({ 
  baseURL: API_BASE_URL,
  // Add request timeout for faster failure detection
  timeout: 10000, // 10 seconds
});

// Simple in-memory cache for GET requests (5 minutes TTL)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (url, params) => {
  return `${url}?${new URLSearchParams(params).toString()}`;
};

const getCachedResponse = (url, params) => {
  const key = getCacheKey(url, params);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedResponse = (url, params, data) => {
  const key = getCacheKey(url, params);
  cache.set(key, { data, timestamp: Date.now() });
};

// Clear cache on POST/PATCH/DELETE to ensure fresh data
const clearRelevantCache = (url) => {
  // Clear all post-related cache when posts are modified
  if (url.includes('/posts')) {
    cache.clear();
  }
};

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    try {
      const profile = JSON.parse(localStorage.getItem('profile'));
      
      // Check if token exists
      if (profile && profile.token) {
        req.headers.Authorization = `Bearer ${profile.token}`;
        
        // For backward compatibility and additional context, send user info
        if (profile.result) {
          // Send email for account linking lookup
          if (profile.result.email) {
            req.headers['X-User-Email'] = profile.result.email;
          }
          // Send Google ID if available
          if (profile.result.googleId) {
            req.headers['X-Google-User-Id'] = profile.result.googleId;
          }
          // Send user name
          if (profile.result.name) {
            req.headers['X-User-Name'] = profile.result.name;
          }
        }
      }
    } catch (error) {
      // If profile is corrupted, clear it
      console.error('Error parsing profile from localStorage:', error);
      localStorage.removeItem('profile');
    }
  }

  return req;
});

// Handle 401 errors - token expired or invalid
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      console.warn('Authentication failed - token expired or invalid');
      
      // For certain actions, show error message instead of auto-logout
      // This prevents logging out users when they're actively using the app
      const url = error.config?.url || '';
      const isUserAction = url.includes('/likePost') || url.includes('/commentPost') || url.includes('/posts/');
      
      if (isUserAction) {
        // For user actions, just clear the token but don't redirect immediately
        // Let the component handle the error gracefully
        console.warn('Token expired during user action - please refresh and try again');
        // Don't clear storage here - let the user finish what they're doing
        // The component should handle the error
        return Promise.reject(error);
      }
      
      // For other cases (like fetching posts), auto-logout
      localStorage.removeItem('profile');
      sessionStorage.removeItem('posts_cache');
      
      // Only redirect if we're not already on the auth page
      if (window.location.pathname !== '/auth' && window.location.pathname !== '/auth/set-password' && window.location.pathname !== '/auth/reset-password') {
        // Small delay to prevent immediate redirect during active use
        setTimeout(() => {
          window.location.href = '/auth';
        }, 1000);
      }
    }
    return Promise.reject(error);
  }
);


// GET requests with caching
export const fetchPost = async (id) => {
  const url = `/posts/${id}`;
  const cached = getCachedResponse(url, {});
  if (cached) {
    return { data: cached }; // Return in same format as axios response
  }
  const response = await API.get(url);
  setCachedResponse(url, {}, response.data);
  return response;
};

export const fetchPosts = async (page) => {
  const url = '/posts';
  const params = { page };
  const cached = getCachedResponse(url, params);
  if (cached) {
    return { data: cached };
  }
  const response = await API.get(url, { params });
  setCachedResponse(url, params, response.data);
  return response;
};

export const fetchPostsByCreator = async (name) => {
  const url = '/posts/creator';
  const params = { name };
  const cached = getCachedResponse(url, params);
  if (cached) {
    return { data: cached };
  }
  const response = await API.get(url, { params });
  setCachedResponse(url, params, response.data);
  return response;
};

export const fetchPostsBySearch = async (searchQuery) => {
  const url = '/posts/search';
  const params = {
    searchQuery: searchQuery.search || 'none',
    tags: searchQuery.tags || ''
  };
  const cached = getCachedResponse(url, params);
  if (cached) {
    return { data: cached };
  }
  const response = await API.get(url, { params });
  setCachedResponse(url, params, response.data);
  return response;
};

// POST/PATCH/DELETE - clear cache and don't cache responses
export const createPost = async (newPost) => {
  clearRelevantCache('/posts');
  return API.post('/posts', newPost);
};

export const likePost = async (id) => {
  clearRelevantCache('/posts');
  return API.patch(`/posts/${id}/likePost`);
};

export const comment = async (value, id) => {
  clearRelevantCache('/posts');
  return API.post(`/posts/${id}/commentPost`, { value });
};

export const updatePost = async (id, updatedPost) => {
  clearRelevantCache('/posts');
  return API.patch(`/posts/${id}`, updatedPost);
};

export const deletePost = async (id) => {
  clearRelevantCache('/posts');
  return API.delete(`/posts/${id}`);
};

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
export const requestPasswordSetup = (email) => API.post('/user/request-password-setup', { email });
export const forgotPassword = (email) => API.post('/user/forgot-password', { email });
export const verifyTokenAndSetPassword = (formData) => API.post('/user/verify-token-set-password', formData);
export const setPassword = (formData) => API.post('/user/set-password', formData); // Keep for backward compatibility





