// Root Reducer for Redux, combines all other reducers into our root reducer
import { combineReducers } from 'redux';
import userReducer from './userReducer';
import gameReducer from './gamesReducer';
import animeReducer from './animesReducer';
import errorReducer from './errorReducer';
import chatReducer from './chatReducer';
import socialReducer from './socialReducer';

// Add all reducers to this function below
const rootReducer: any = combineReducers({
  user: userReducer,
  games: gameReducer,
  animes: animeReducer,
  errors: errorReducer,
  chat: chatReducer,
  social: socialReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
