import {
  ANIMES_LOADING,
  GET_ANIME_PREFERENCES_SUCCESS,
  GET_ANIME_PREFERENCES_FAILED,
  UPDATE_ANIME_PREFERENCES_SUCCESS,
  UPDATE_ANIME_PREFERENCES_FAILED,
  IAnimesState,
  AnimeActionTypes,
} from '../actions/types';

const initialState: IAnimesState = {
  animePreferences: {},
  animesLoading: false,
};

export default function (
  state = initialState,
  action: AnimeActionTypes
): IAnimesState {
  switch (action.type) {
    case GET_ANIME_PREFERENCES_SUCCESS:
      return {
        ...state,
        animePreferences: action!.payload,
        animesLoading: false,
      };
    case GET_ANIME_PREFERENCES_FAILED:
      return {
        ...state,
        animePreferences: {},
        animesLoading: false,
      };
    case UPDATE_ANIME_PREFERENCES_SUCCESS:
      return {
        ...state,
        animePreferences: action!.payload,
        animesLoading: false,
      };
    case UPDATE_ANIME_PREFERENCES_FAILED:
      return {
        ...state,
        animesLoading: false,
      };
    case ANIMES_LOADING:
      return {
        ...state,
        animesLoading: true,
      };
    default:
      return state;
  }
}
