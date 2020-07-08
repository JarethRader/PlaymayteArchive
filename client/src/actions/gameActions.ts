import {
  GAMES_LOADING,
  GET_GAME_PREFERENCES_SUCCESS,
  GET_GAME_PREFERENCES_FAILED,
  UPDATE_GAME_PREFERENCES_SUCCESS,
  UPDATE_GAME_PREFERENCES_FAILED,
  GamesObj,
  GameActionTypes,
} from './types';

import { API, CSRFConfig } from './utils/config';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { RootState } from '../reducers/index';

type GamesThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<GameActionTypes>
>;

export const getGamePreferences = (): GamesThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  dispatch({ type: 'GAMES_LOADING' });

  try {
    await fetch(API + '/games/', {
      method: 'GET',
      credentials: 'include',
      headers: CSRFConfig(),
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          throw new Error('failed to authenticate user');
        }
      })
      .then((responseJson) => {
        dispatch({
          type: GET_GAME_PREFERENCES_SUCCESS,
          payload: responseJson,
        });
      })
      .catch((err: Error) => {
        throw err;
      });
  } catch (err) {
    dispatch({
      type: GET_GAME_PREFERENCES_FAILED,
    });
  }
};

export const updateGamePreferences = (
  updatedGamePrefs: GamesObj
): GamesThunk => async (dispatch: ThunkDispatch<RootState, void, Action>) => {
  dispatch({ type: 'GAMES_LOADING' });

  try {
    await fetch(API + '/games/update', {
      method: 'PUT',
      credentials: 'include',
      headers: CSRFConfig(),
      body: JSON.stringify(updatedGamePrefs),
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          throw new Error('failed to authenticate user');
        }
      })
      .then((responseJson) => {
        dispatch({
          type: UPDATE_GAME_PREFERENCES_SUCCESS,
          payload: responseJson,
        });
      })
      .catch((err: Error) => {
        throw err;
      });
  } catch (err) {
    dispatch({
      type: UPDATE_GAME_PREFERENCES_FAILED,
    });
  }
};

export function setGamesLoading(): GameActionTypes {
  return {
    type: GAMES_LOADING,
  };
}
