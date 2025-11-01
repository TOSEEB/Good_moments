import axios from 'axios';

// React Scripts injects process.env variables at build time
// Access them safely
const API_BASE_URL = typeof process !== 'undefined' && process.env ? process.env.REACT_APP_API_URL : undefined;

if (!API_BASE_URL) {
  throw new Error('REACT_APP_API_URL is required. Please add it to your .env file.');
}

const API = axios.create({ baseURL: API_BASE_URL });

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
      // Token expired or invalid - clear storage and redirect to login
      console.warn('Authentication failed - token expired or invalid');
      localStorage.removeItem('profile');
      sessionStorage.removeItem('posts_cache');
      
      // Only redirect if we're not already on the auth page
      if (window.location.pathname !== '/auth' && window.location.pathname !== '/auth/set-password' && window.location.pathname !== '/auth/reset-password') {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);


export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const fetchPostsByCreator = (name) => API.get(`/posts/creator?name=${name}`);
export const fetchPostsBySearch = (searchQuery) => API.get('/posts/search', {
  params: {
    searchQuery: searchQuery.search || 'none',
    tags: searchQuery.tags || ''
  }
});
export const createPost = (newPost) => API.post('/posts', newPost);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const comment = (value, id) => API.post(`/posts/${id}/commentPost`, { value });
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
export const requestPasswordSetup = (email) => API.post('/user/request-password-setup', { email });
export const forgotPassword = (email) => API.post('/user/forgot-password', { email });
export const verifyTokenAndSetPassword = (formData) => API.post('/user/verify-token-set-password', formData);
export const setPassword = (formData) => API.post('/user/set-password', formData); // Keep for backward compatibility





