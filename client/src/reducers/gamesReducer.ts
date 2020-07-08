import {
  GAMES_LOADING,
  GET_GAME_PREFERENCES_SUCCESS,
  GET_GAME_PREFERENCES_FAILED,
  UPDATE_GAME_PREFERENCES_SUCCESS,
  UPDATE_GAME_PREFERENCES_FAILED,
  IGamesState,
  GameActionTypes,
} from '../actions/types';

const initialState: IGamesState = {
  gamePreferences: {},
  gamesLoading: false,
};

export default function (
  state = initialState,
  action: GameActionTypes
): IGamesState {
  switch (action.type) {
    case GET_GAME_PREFERENCES_SUCCESS:
      return {
        ...state,
        gamePreferences: action!.payload,
        gamesLoading: false,
      };
    case GET_GAME_PREFERENCES_FAILED:
      return {
        ...state,
        gamePreferences: {},
        gamesLoading: false,
      };
    case UPDATE_GAME_PREFERENCES_SUCCESS:
      return {
        ...state,
        gamePreferences: action!.payload,
        gamesLoading: false,
      };
    case UPDATE_GAME_PREFERENCES_FAILED:
      return {
        ...state,
        gamesLoading: false,
      };
    case GAMES_LOADING:
      return {
        ...state,
        gamesLoading: true,
      };
    default:
      return state;
  }
}
