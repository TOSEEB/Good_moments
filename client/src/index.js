import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { reducers } from './reducers';
import App from './App';
import './index.css';

// Initialize auth state from localStorage
const initializeAuth = () => {
  const profile = localStorage.getItem('profile');
  if (profile) {
    try {
      const parsed = JSON.parse(profile);
      return { auth: { authData: parsed } };
    } catch (error) {
      return {};
    }
  }
  return {};
};

const store = createStore(reducers, initializeAuth(), compose(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
