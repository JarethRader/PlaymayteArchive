import {
  ANIMES_LOADING,
  GET_ANIME_PREFERENCES_SUCCESS,
  GET_ANIME_PREFERENCES_FAILED,
  UPDATE_ANIME_PREFERENCES_SUCCESS,
  UPDATE_ANIME_PREFERENCES_FAILED,
  AnimesObj,
  AnimeActionTypes,
} from './types';

import { API, CSRFConfig } from './utils/config';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { RootState } from '../reducers/index';

type AnimeThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<AnimeActionTypes>
>;

export const getAnimePreferences = (): AnimeThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  dispatch({ type: 'ANIMES_LOADING' });

  try {
    await fetch(API + '/animes/', {
      method: 'GET',
      credentials: 'include',
      headers: CSRFConfig(),
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300)
          return response.json();
        throw new Error('failed to authenticate user');
      })
      .then((responseJson) => {
        dispatch({
          type: GET_ANIME_PREFERENCES_SUCCESS,
          payload: responseJson,
        });
      })
      .catch((err: Error) => {
        throw err;
      });
  } catch (err) {
    return {
      type: GET_ANIME_PREFERENCES_FAILED,
    };
  }
};

export const updateAnimePreferences = (
  updatedAnimePrefs: AnimesObj
): AnimeThunk => async (dispatch: ThunkDispatch<RootState, void, Action>) => {
  dispatch({ type: 'ANIMES_LOADING' });

  try {
    await fetch(API + '/animes/update', {
      method: 'PUT',
      credentials: 'include',
      headers: CSRFConfig(),
      body: JSON.stringify(updatedAnimePrefs),
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
          type: UPDATE_ANIME_PREFERENCES_SUCCESS,
          payload: responseJson,
        });
      })
      .catch((err: Error) => {
        throw err;
      });
  } catch (err) {
    return {
      type: UPDATE_ANIME_PREFERENCES_FAILED,
    };
  }
};

export function setAnimesLoading(): AnimeActionTypes {
  return {
    type: ANIMES_LOADING,
  };
}
