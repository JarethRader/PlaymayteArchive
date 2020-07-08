import {
  CHAT_LOADING,
  CONNECT_SOCKET_SUCCESS,
  CONNECT_SOCKET_FAILED,
  DISCONNECT_SOCKET_SUCCESS,
  DISCONNECT_SOCKET_FAILED,
  GET_CHAT_LOG_FAILED,
  GET_CHAT_LOG_SUCCESS,
  UPDATE_CHAT_LOG,
  ChatActionTypes,
  DELETE_CHAT_SUCCESS,
  DELETE_CHAT_FAILED,
  CLEAR_CHAT,
  IMessage,
} from './types';

import io from 'socket.io-client';

// import { returnErrors } from './errorActions';

import { BASE, API, CSRFConfig } from './utils/config';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { RootState } from '../reducers/index';

type UserThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<ChatActionTypes>
>;

export const connectSocket = (): UserThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  dispatch({ type: CHAT_LOADING });

  try {
    const socket = io.connect(BASE);
    dispatch({
      type: CONNECT_SOCKET_SUCCESS,
      payload: socket,
    });
  } catch (err) {
    dispatch({
      type: CONNECT_SOCKET_FAILED,
    });
  }
};

export const disconnectSocket = (
  socket: SocketIOClient.Socket
): UserThunk => async (dispatch: ThunkDispatch<RootState, void, Action>) => {
  dispatch({ type: CHAT_LOADING });
  try {
    socket.close();
    dispatch({
      type: DISCONNECT_SOCKET_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: DISCONNECT_SOCKET_FAILED,
    });
  }
};

export const getChatLog = (roomID: string): UserThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  dispatch({ type: CHAT_LOADING });

  try {
    await fetch(API + '/social/history', {
      method: 'POST',
      credentials: 'include',
      headers: CSRFConfig(),
      body: JSON.stringify({ roomID }),
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
          type: GET_CHAT_LOG_SUCCESS,
          payload: responseJson.history,
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    dispatch({
      type: GET_CHAT_LOG_FAILED,
    });
  }
};

export const updateChatLog = (message: IMessage): UserThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  dispatch({ type: CHAT_LOADING });
  dispatch({
    type: UPDATE_CHAT_LOG,
    payload: message,
  });
};

export const deleteRoom = (roomID: string): UserThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  dispatch({ type: CHAT_LOADING });
  try {
    await fetch(API + '/social/room', {
      method: 'DELETE',
      credentials: 'include',
      headers: CSRFConfig(),
      body: JSON.stringify({ roomID }),
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
          type: DELETE_CHAT_SUCCESS,
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    dispatch({
      type: DELETE_CHAT_FAILED,
    });
  }
};

export const clearChatLogs = (): UserThunk => async (
  dispatch: ThunkDispatch<RootState, void, Action>
) => {
  dispatch({
    type: CLEAR_CHAT,
  });
};

export function setChatLoading(): ChatActionTypes {
  return {
    type: CHAT_LOADING,
  };
}
