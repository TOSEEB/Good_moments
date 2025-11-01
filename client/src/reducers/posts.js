import { FETCH_ALL, FETCH_BY_SEARCH, FETCH_BY_CREATOR, FETCH_POST, CREATE, UPDATE, DELETE, LIKE, COMMENT } from '../constants/actionTypes';

// Load initial state from sessionStorage if available for faster initial render
const getInitialState = () => {
  try {
    const cached = sessionStorage.getItem('posts_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      // Only use cache if it's less than 5 minutes old
      if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
        return { isLoading: false, posts: parsed.posts || [] };
      }
    }
  } catch (error) {
    // Ignore cache errors
  }
  return { isLoading: true, posts: [] };
};

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'START_LOADING':
      return { ...state, isLoading: true };
    case 'END_LOADING':
      return { ...state, isLoading: false };
    case FETCH_ALL:
      const newState = {
        ...state,
        posts: action.payload.data,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages,
        isLoading: false,
      };
      // Cache posts in sessionStorage for faster reload
      try {
        sessionStorage.setItem('posts_cache', JSON.stringify({
          posts: action.payload.data,
          timestamp: Date.now(),
        }));
      } catch (error) {
        // Ignore cache errors
      }
      return newState;
    case FETCH_BY_SEARCH:
    case FETCH_BY_CREATOR:
      return { ...state, posts: action.payload.data };
    case FETCH_POST:
      return { ...state, post: action.payload.post };
    case LIKE:
      return { 
        ...state, 
        posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)),
        post: state.post && state.post._id === action.payload._id ? action.payload : state.post
      };
    case COMMENT:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post._id === action.payload._id) {
            return action.payload;
          }
          return post;
        }),
      };
    case CREATE:
      return { ...state, posts: [...state.posts, action.payload] };
    case UPDATE:
      return { ...state, posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)) };
    case DELETE:
      return { ...state, posts: state.posts.filter((post) => post._id !== action.payload) };
    default:
      return state;
  }
};

