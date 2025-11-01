import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const signin = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);

    // Check if user needs to set password (Google login only account)
    if (data.needsPassword) {
      return { needsPassword: true, message: data.message };
    }

    dispatch({ type: AUTH, data });

    router.push('/');
  } catch (error) {
    // Check if error response indicates password needs to be set
    if (error.response?.data?.needsPassword) {
      return { needsPassword: true, message: error.response.data.message };
    }
    throw error;
  }
};

export const setPasswordForGoogleUser = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.setPassword(formData);

    dispatch({ type: AUTH, data });

    router.push('/');
  } catch (error) {
    // Error setting password
    throw error;
  }
};

export const signup = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);

    dispatch({ type: AUTH, data });

    router.push('/');
  } catch (error) {
    // Error signing in
  }
};

