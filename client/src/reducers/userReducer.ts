import {
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT_SUCCESS,
  LOGOUT_FAILED,
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
  IUserState,
  UserActionTypes,
} from '../actions/types';

import ReactGA from '../actions/utils/initilizeGA';

const initialState: IUserState = {
  userInfo: {},
  aboutMe: '',
  isAuthenticated: false,
  isVerified: false,
  userLoading: false,
};

export default function (
  state = initialState,
  action: UserActionTypes
): IUserState {
  switch (action!.type) {
    case USER_LOADED:
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      ReactGA.set({
        userId: action.payload!.id!,
      });
      return {
        ...state,
        userInfo: action!.payload,
        isAuthenticated: true,
        userLoading: false,
      };
    case GET_VERIFIED_SUCCESS:
      return {
        ...state,
        isVerified: action.payload,
        userLoading: false,
      };
    case AUTH_ERROR:
    case REGISTER_FAILED:
    case LOGIN_FAILED:
    case LOGOUT_FAILED:
    case LOGOUT_SUCCESS:
      return {
        ...state,
        userInfo: {},
        isAuthenticated: false,
        userLoading: false,
      };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        userInfo: action!.payload,
        userLoading: false,
      };
    case GET_ABOUT_SUCCESS:
    case UPDATE_ABOUT_SUCCESS:
      return {
        ...state,
        aboutMe: action!.payload,
        userLoading: false,
      };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        userInfo: {},
        aboutMe: '',
        isAuthenticated: false,
        userLoading: false,
      };
    case DELETE_USER_FAILED:
      return {
        ...state,
        userLoading: false,
      };
    case UPDATE_PASSWORD_SUCCESS:
    case UPDATE_PASSWORD_FAILED:
    case GET_VERIFIED_FAILED:
    case UPDATE_USER_FAILED:
    case GET_ABOUT_FAILED:
    case UPDATE_ABOUT_FAILED:
    case USER_LOADING:
      return {
        ...state,
        userLoading: true,
      };
    default:
      return state;
  }
}
