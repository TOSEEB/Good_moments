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
    const profile = JSON.parse(localStorage.getItem('profile'));
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

  return req;
});


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





