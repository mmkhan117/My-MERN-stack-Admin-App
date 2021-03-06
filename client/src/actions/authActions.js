import axios from "axios";
import { returnErrors } from "./errorActions";

import {
  USER_LOADED,
  GET_USERS,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  TFA_SUCCESS,
  TFA_FAIL,
  TFA_SETUP_SUCCESS,
  TFA_LOADED,
  ALL_USERS_LOADED
} from "./types";

// Check token & load user
export const loadUser = () => (dispatch, getState) => {
  // User loading
  dispatch({ type: USER_LOADING });

  axios
    .get("/api/auth/user", tokenConfig(getState))
    .then(res =>
      dispatch({
        type: USER_LOADED,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR
      });
    });
};

// get all registered users
export const getAllUsers = () => (dispatch, getState) => {
  // User loading
  dispatch({ type: USER_LOADING });

  axios
    .get("/api/users", tokenConfig(getState))
    .then(res =>
      dispatch({
        type: ALL_USERS_LOADED,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR
      });
    });
};

// Register User
export const register = ({ name, email, password }) => dispatch => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  // Request body
  const body = JSON.stringify({ name, email, password });

  const authPromise = axios
    .post("/api/users", body, config)
    .then(res =>
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "REGISTER_FAIL")
      );
      dispatch({
        type: REGISTER_FAIL
      });
    });

  //not sure if it is the right way to do redux.
  return authPromise;
};

// Login User

export const login = ({ email, password }) => dispatch => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  // Request body
  const body = JSON.stringify({ email, password });

  const authPromise = axios
    .post("/api/auth", body, config)
    .then(res =>
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "LOGIN_FAIL")
      );
      dispatch({
        type: LOGIN_FAIL
      });
    });

  //not sure if it is the right way to do redux.
  return authPromise;
};

// Logout User
export const logout = () => {
  return {
    type: LOGOUT_SUCCESS
  };
};

// Setup config/headers and token
export const tokenConfig = getState => {
  // Get token from localstorage
  const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      "Content-type": "application/json"
    }
  };

  // If token, add to headers
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return config;
};

// --------------------------- google 2fa auth . ---------------------------------------------//
// --------------------------- google 2fa auth . ---------------------------------------------//
// --------------------------- google 2fa auth . ---------------------------------------------//
// --------------------------- google 2fa auth . ---------------------------------------------//

export const getTFA = ({ email, domainName }) => dispatch => {
  // TFAing
  // dispatch({ type: TFA_ING });
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  // Request body
  const body = JSON.stringify({ email, domainName });
  const authPromise = axios
    .post("/api/TFA/", body, config)
    .then(res => {
      dispatch({
        type: TFA_LOADED,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "TFA_FAIL")
      );
      dispatch({
        type: TFA_FAIL
      });
    });

  //not sure if it is the right way to do redux.
  return authPromise;
};

// google 2fa auth setup.
export const TFASetup = ({ email, domainName }) => dispatch => {
  // TFAing
  // dispatch({ type: TFA_ING });
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  // Request body
  const body = JSON.stringify({ email, domainName });
  const authPromise = axios
    .post("/api/TFA/setup", body, config)
    .then(res => {
      dispatch({
        type: TFA_SETUP_SUCCESS,
      });
      
    })
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "TFA_FAIL")
      );
      dispatch({
        type: TFA_FAIL
      });
    });

  //not sure if it is the right way to do redux.
  return authPromise;
};

// google 2fa auth verify.
export const TFAVerify = (email, code) => dispatch => {
  // TFAing
  // dispatch({ type: TFA_ING });
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  // Request body
  const body = JSON.stringify({ email, code });
  const authPromise = axios
    .post("/api/TFA/verify", body, config)
    .then(res =>
      dispatch({
        type: TFA_SUCCESS
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "TFA_FAIL")
      );
      dispatch({
        type: TFA_FAIL
      });
    });

  //not sure if it is the right way to do redux.
  return authPromise;
};
