import {
  SOCIAL_LOADING,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILED,
  GET_ROOMS_SUCCESS,
  GET_ROOMS_FAILED,
  REMOVE_FRIEND_SUCCESS,
  REMOVE_FRIEND_FAILED,
  MATCH_SUCCESS,
  MATCH_FAILED,
  PASS_SUCCESS,
  PASS_FAILED,
  GET_PROPSECTS_SUCCESS,
  GET_PROPSECTS_FAILED,
  CLEAR_PROSPECTS,
  SocialActionTypes,
  ISocialState,
} from './types';

import { API, CSRFConfig } from './utils/config';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { RootState } from '../reducers/index';

import ReactGA from './utils/initilizeGA';

type UserThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<SocialActionTypes>
>;

export const getUsersProfile = (userID: string): UserThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  dispatch({ type: SOCIAL_LOADING });
  try {
    await fetch(API + '/social/user', {
      method: 'POST',
      credentials: 'include',
      headers: CSRFConfig(),
      body: JSON.stringify({
        userID,
      }),
    }) /* tslint:disable */
      .then(async (response) => {
        /* tslint:enable */
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const errorObj = await response.json();
          throw new Error(errorObj.err);
        }
      })
      .then((responseJson) => {
        dispatch({
          type: GET_PROFILE_SUCCESS,
          payload: responseJson,
        });
      })
      .catch((err: Error) => {
        throw err;
      });
  } catch (err) {
    console.error(err);
    dispatch({
      type: GET_PROFILE_FAILED,
    });
  }
};

export const getRooms = (): UserThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  dispatch({ type: SOCIAL_LOADING });

  try {
    await fetch(API + '/social/rooms', {
      method: 'GET',
      credentials: 'include',
      headers: CSRFConfig(),
    })
      /* tslint:disable */
      .then(async (response) => {
        /* tslint:enable */
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const errorObj = await response.json();
          throw new Error(errorObj.err);
        }
      })
      .then(async (responseJson) => {
        dispatch({
          type: GET_ROOMS_SUCCESS,
          payload: responseJson.friendList,
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    dispatch({
      type: GET_ROOMS_FAILED,
    });
  }
};

export const removeFriend = (
  roomID: string,
  friendID: string
): UserThunk => async (dispatch: ThunkDispatch<RootState, void, Action>) => {
  dispatch({ type: SOCIAL_LOADING });
  try {
    await fetch(API + '/social/friend', {
      method: 'DELETE',
      credentials: 'include',
      headers: CSRFConfig(),
      body: JSON.stringify({
        roomID,
        friendID,
      }),
    })
      /* tslint:disable */
      .then(async (response) => {
        /* tslint:enable */
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const errorObj = await response.json();
          throw new Error(errorObj.err);
        }
      })
      .then((reponseJson) => {
        dispatch({
          type: REMOVE_FRIEND_SUCCESS,
          payload: reponseJson.friendList,
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    dispatch({
      type: REMOVE_FRIEND_FAILED,
    });
  }
};

export const match = (matchID: string): UserThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  ReactGA.event({
    category: 'Match',
    action: 'User has matched with another user',
  });
  dispatch({ type: SOCIAL_LOADING });
  try {
    await fetch(API + '/prospects/match', {
      method: 'POST',
      credentials: 'include',
      headers: CSRFConfig(),
      body: JSON.stringify({ matchWith: matchID }),
    })
      /* tslint:disable */
      .then(async (response) => {
        /* tslint:enable */
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const errorObj = await response.json();
          throw new Error(errorObj.err);
        }
      })
      .then((responseJson) => {
        dispatch({
          type: MATCH_SUCCESS,
          payload: matchID,
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    dispatch({
      type: MATCH_FAILED,
    });
  }
};

export const pass = (passID: string): UserThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  ReactGA.event({
    category: 'Pass',
    action: 'User has passed on another user',
  });
  dispatch({ type: SOCIAL_LOADING });
  try {
    await fetch(API + '/prospects/pass', {
      method: 'POST',
      credentials: 'include',
      headers: CSRFConfig(),
      body: JSON.stringify({ unmatchWith: passID }),
    })
      /* tslint:disable */
      .then(async (response) => {
        /* tslint:enable */
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const errorObj = await response.json();
          throw new Error(errorObj.err);
        }
      })
      .then((responseJson) => {
        dispatch({
          type: PASS_SUCCESS,
          payload: passID,
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch {
    dispatch({ type: PASS_FAILED });
  }
};

export const getProspects = (): UserThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  dispatch({ type: SOCIAL_LOADING });
  try {
    await fetch(API + '/prospects/', {
      method: 'GET',
      credentials: 'include',
      headers: CSRFConfig(),
    }) /* tslint:disable */
      .then(async (response) => {
        /* tslint:enable */
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const errorObj = await response.json();
          throw new Error(errorObj.err);
        }
      })
      .then((responseJson) => {
        dispatch({
          type: GET_PROPSECTS_SUCCESS,
          payload: responseJson.prospects,
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    dispatch({
      type: GET_PROPSECTS_FAILED,
    });
  }
};

export const ClearProspects = (): UserThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  dispatch({
    type: CLEAR_PROSPECTS,
  });
};

export function setDiscoverLoading(): SocialActionTypes {
  return {
    type: SOCIAL_LOADING,
  };
}
