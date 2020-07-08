import {
  CHAT_LOADING,
  CONNECT_SOCKET_SUCCESS,
  CONNECT_SOCKET_FAILED,
  DISCONNECT_SOCKET_SUCCESS,
  DISCONNECT_SOCKET_FAILED,
  GET_CHAT_LOG_SUCCESS,
  GET_CHAT_LOG_FAILED,
  UPDATE_CHAT_LOG,
  DELETE_CHAT_SUCCESS,
  DELETE_CHAT_FAILED,
  CLEAR_CHAT,
  ChatActionTypes,
  IChatState,
} from '../actions/types';

const initialState: IChatState = {
  socket: null,
  chatLoading: false,
  chatLog: [],
};

export default function (
  state = initialState,
  action: ChatActionTypes
): IChatState {
  switch (action.type) {
    case CONNECT_SOCKET_SUCCESS:
      return {
        ...state,
        socket: action.payload,
        chatLoading: false,
      };
    case DISCONNECT_SOCKET_SUCCESS:
      return {
        ...state,
        socket: null,
        chatLoading: false,
      };
    case GET_CHAT_LOG_SUCCESS:
      return {
        ...state,
        chatLog: action.payload,
        chatLoading: false,
      };
    case UPDATE_CHAT_LOG:
      state.chatLog?.push(action.payload);
      return {
        ...state,
        chatLog: state.chatLog,
        chatLoading: false,
      };
    case CLEAR_CHAT:
      return {
        ...state,
        chatLog: [],
        chatLoading: false,
      };
    case DELETE_CHAT_SUCCESS:
    case DELETE_CHAT_FAILED:
    case GET_CHAT_LOG_FAILED:
    case DISCONNECT_SOCKET_FAILED:
    case CONNECT_SOCKET_FAILED:
      return {
        ...state,
        chatLoading: false,
      };
    case CHAT_LOADING:
      return {
        ...state,
        chatLoading: true,
      };
    default:
      return state;
  }
}
