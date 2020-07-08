/**
 * @Author Jareth Rader
 * @desc These are the user actions
 * 1. login -> Login action for signin page
 * 2. register -> Register a new user
 * 3. loadUser -> Check if there is a current user
 * 4. logout -> Logout current user
 * 5. updateUserInfo -> Update user information
 * 6. setUserLoading -> set loading to true while actions are running
 */
import {
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  USER_LOADING,
  AUTH_ERROR,
  USER_LOADED,
  LOGOUT_FAILED,
  LOGOUT_SUCCESS,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILED,
  UPDATE_ABOUT_SUCCESS,
  UPDATE_ABOUT_FAILED,
  GET_ABOUT_SUCCESS,
  GET_ABOUT_FAILED,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILED,
  GET_VERIFIED_SUCCESS,
  GET_VERIFIED_FAILED,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAILED,
  UserActionTypes,
  RegistrationObj,
  UpdateObj,
  errorTypes,
} from './types';

import { connectSocket } from './chatActions';
import { returnErrors } from './errorActions';

import { API, CSRFConfig } from './utils/config';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { RootState } from '../reducers/index';

import ReactGA from './utils/initilizeGA';

type UserThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<UserActionTypes>
>;

/**
 * @desc Login action for signin page
 * @param email
 * @param password
 */
export const login = (email: string, password: string): UserThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  ReactGA.event({
    category: 'Login',
    action: 'User has logged into their account',
  });
  dispatch({ type: 'USER_LOADING' });
  const body = { email, password };
  try {
    await fetch(API + '/user/login', {
      method: 'POST',
      credentials: 'include',
      headers: CSRFConfig(),
      body: JSON.stringify(body),
    })
      .then(async (response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const errorObj = await response.json();
          throw new Error(errorObj.err);
        }
      })
      .then((responseJson) => {
        dispatch(connectSocket());
        dispatch({
          type: LOGIN_SUCCESS,
          payload: responseJson,
        });
      })
      .catch((err: Error) => {
        throw err;
      });
  } catch (err) {
    if (err.message !== 'Unexpected token < in JSON at position 0') {
      dispatch(returnErrors(errorTypes.login, err.message, 400));
      dispatch({
        type: LOGIN_FAILED,
      });
    } else {
      dispatch(returnErrors(errorTypes.login, 'An error occured', 400));
      dispatch({
        type: LOGIN_FAILED,
      });
    }
  }
};

/**
 * @desc Register a new user
 * @param body
 */
export const register = (body: RegistrationObj): UserThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  ReactGA.event({
    category: 'Sign up',
    action: 'A new user has signed up',
  });
  dispatch({ type: 'USER_LOADING' });
  try {
    await fetch(API + '/user/register', {
      method: 'POST',
      credentials: 'include',
      headers: CSRFConfig(),
      body: JSON.stringify(body),
    })
      .then(async (response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const errorObj = await response.json();
          throw new Error(errorObj.err);
        }
      })
      .then((responseJson) => {
        dispatch(connectSocket());
        dispatch({
          type: REGISTER_SUCCESS,
          payload: responseJson,
        });
      })
      .catch((err: Error) => {
        throw err;
      });
  } catch (err) {
    if (err.message !== 'Unexpected token < in JSON at position 0') {
      dispatch(returnErrors(errorTypes.login, err.message, 400));
      dispatch({
        type: REGISTER_FAILED,
      });
    } else {
      dispatch(returnErrors(errorTypes.login, 'An error occured', 400));
      dispatch({
        type: REGISTER_FAILED,
      });
    }
  }
};

/**
 * @desc Check if there is a current user
 */
export const loadUser = (): UserThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  dispatch({ type: 'USER_LOADING' });
  try {
    await fetch(API + '/user/info', {
      method: 'GET',
      credentials: 'include',
      headers: CSRFConfig(),
    })
      .then(async (response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const errorObj = await response.json();
          throw new Error(errorObj.err);
        }
      })
      .then((responseJson) => {
        dispatch({
          type: USER_LOADED,
          payload: responseJson,
        });
      })
      .catch((err: Error) => {
        throw err;
      });
  } catch (err) {
    // dispatch(returnErrors(errorTypes.login, err.message, 400));
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

/**
 * @desc Logout current user
 */
export const logout = (): UserThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  ReactGA.event({
    category: 'Log out',
    action: 'User has log out from their account',
  });
  dispatch({
    type: USER_LOADING,
  });
  try {
    await fetch(API + '/user/logout', {
      method: 'POST',
      credentials: 'include',
      headers: CSRFConfig(),
    })
      .then(async (response) => {
        if (response.status >= 200 && response.status < 300) {
          dispatch({ type: LOGOUT_SUCCESS });
        } else {
          const errorObj = await response.json();
          throw new Error(errorObj.err);
        }
      })
      .catch((err: Error) => {
        throw err;
      });
  } catch (err) {
    dispatch(returnErrors(errorTypes.login, err.message, 400));
    dispatch({ type: LOGOUT_FAILED });
  }
};

/**
 * @desc Update user information
 */
export const updateUserInfo = (updatedUserInfo: UpdateObj): UserThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  dispatch({ type: USER_LOADING });
  try {
    await fetch(API + '/user/updateInfo', {
      method: 'PUT',
      credentials: 'include',
      headers: CSRFConfig(),
      body: JSON.stringify(updatedUserInfo),
    })
      .then(async (response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const errorObj = await response.json();
          throw new Error(errorObj.err);
        }
      })
      .then((responseJson) => {
        dispatch({
          type: UPDATE_USER_SUCCESS,
          payload: responseJson,
        });
      })
      .catch((err: Error) => {
        throw err;
      });
  } catch (err) {
    dispatch(returnErrors(errorTypes.login, err.message, 400));
    dispatch({ type: UPDATE_USER_FAILED });
  }
};

export const getAboutMe = (): UserThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  dispatch({ type: USER_LOADING });

  try {
    await fetch(API + '/user/about', {
      method: 'GET',
      credentials: 'include',
      headers: CSRFConfig(),
    })
      .then(async (response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const errorObj = await response.json();
          throw new Error(errorObj.err);
        }
      })
      .then((responseJson) => {
        dispatch({
          type: GET_ABOUT_SUCCESS,
          payload: responseJson.aboutMe,
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    dispatch(returnErrors(errorTypes.login, err.message, 400));
    dispatch({
      type: GET_ABOUT_FAILED,
    });
  }
};

export const updateAboutMe = (updatedAboutMe: string): UserThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  dispatch({ type: USER_LOADING });
  try {
    await fetch(API + '/user/about', {
      method: 'PUT',
      credentials: 'include',
      headers: CSRFConfig(),
      body: JSON.stringify({ aboutMe: updatedAboutMe }),
    })
      .then(async (response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const errorObj = await response.json();
          throw new Error(errorObj.err);
        }
      })
      .then((responseJson) => {
        dispatch({
          type: UPDATE_ABOUT_SUCCESS,
          payload: responseJson,
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    dispatch(returnErrors(errorTypes.login, err.message, 400));
    dispatch({
      type: UPDATE_ABOUT_FAILED,
    });
  }
};

export const deleteUser = (): UserThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  ReactGA.event({
    category: 'delete account',
    action: 'User has deleted their account',
  });
  dispatch({ type: USER_LOADING });
  try {
    await fetch(API + '/user', {
      method: 'DELETE',
      credentials: 'include',
      headers: CSRFConfig(),
    })
      .then(async (response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const errorObj = await response.json();
          throw new Error(errorObj.err);
        }
      })
      .then((responseJson) => {
        dispatch({
          type: DELETE_USER_SUCCESS,
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    dispatch({
      type: DELETE_USER_FAILED,
    });
  }
};

export const checkVerification = (): UserThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  dispatch({ type: USER_LOADING });
  try {
    await fetch(API + '/verification/isVerified', {
      method: 'GET',
      credentials: 'include',
      headers: CSRFConfig(),
    })
      .then(async (response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const errorObj = await response.json();
          throw new Error(errorObj.err);
        }
      })
      .then((responseJson) => {
        dispatch({
          type: GET_VERIFIED_SUCCESS,
          payload: responseJson.verified,
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    dispatch({
      type: GET_VERIFIED_FAILED,
    });
  }
};

export const UpdatePassword = (
  currentPassword: string,
  newPassword: string
): UserThunk => async (dispatch: ThunkDispatch<RootState, void, Action>) => {
  dispatch({ type: USER_LOADING });
  try {
    await fetch(API + '/user/passwordUpdate', {
      method: 'POST',
      credentials: 'include',
      headers: CSRFConfig(),
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    })
      .then(async (response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const errorObj = await response.json();
          throw new Error(errorObj.err);
        }
      })
      .then((responseJson) => {
        dispatch({
          type: UPDATE_PASSWORD_SUCCESS,
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    dispatch(returnErrors(errorTypes.updatePassword, err.message, 400));
    dispatch({
      type: UPDATE_PASSWORD_FAILED,
    });
  }
};

/**
 * @desc set loading to true while actions are running
 */
export function setUserLoading(): UserActionTypes {
  return {
    type: USER_LOADING,
  };
}
