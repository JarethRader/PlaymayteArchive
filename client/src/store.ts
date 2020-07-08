import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import rootReducer from './reducers';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const devToolsExtension: any = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
  : (f: any) => f;

const initialState = {};

const middleware = [ReduxThunk];

const store: any = createStore(
  rootReducer,
  initialState,
  process.env.NODE_ENV === 'development'
    ? compose(applyMiddleware(...middleware), devToolsExtension)
    : compose(applyMiddleware(...middleware))
);

export default store;
