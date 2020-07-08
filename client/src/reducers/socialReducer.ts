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
} from '../actions/types';

const initialState: ISocialState = {
  socialLoading: false,
  selectedUser: {},
  friendList: [],
  prospectList: [],
};

export default function (
  state = initialState,
  action: SocialActionTypes
): ISocialState {
  switch (action.type) {
    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        selectedUser: action.payload,
        socialLoading: false,
      };
    case REMOVE_FRIEND_SUCCESS:
    case GET_ROOMS_SUCCESS:
      return {
        ...state,
        friendList: action.payload,
        socialLoading: false,
      };
    case GET_PROPSECTS_SUCCESS:
      return {
        ...state,
        prospectList: action.payload,
        socialLoading: false,
      };
    case CLEAR_PROSPECTS:
      return {
        ...state,
        prospectList: [],
        selectedUser: {},
        socialLoading: false,
      };
    case MATCH_SUCCESS:
    case PASS_SUCCESS:
    case PASS_FAILED:
    case GET_PROPSECTS_FAILED:
    case MATCH_FAILED:
    case REMOVE_FRIEND_FAILED:
    case GET_ROOMS_FAILED:
    case GET_PROFILE_FAILED:
      return {
        ...state,
        socialLoading: false,
      };
    case SOCIAL_LOADING:
      return {
        ...state,
        socialLoading: true,
      };
    default:
      return state;
  }
}
