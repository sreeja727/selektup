import { combineReducers, configureStore } from '@reduxjs/toolkit';
import reduxLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

const { createLogger } = reduxLogger;
import rootReducers from './rootReducers';
import rootSaga from './rootSaga';

export const RESET_STORE = 'RESET_STORE';

const sagaMiddleware = createSagaMiddleware();

const middleWares = [];
middleWares.push(sagaMiddleware);

if (import.meta.env.MODE === 'development') {
  middleWares.push(createLogger());
}

const combinedReducer = combineReducers({
  ...rootReducers
});

const rootReducer = (state, action) => {
  // Reset entire store to initial state when dispatch type as RESET_STORE
  if (action.type === RESET_STORE) {
    return combinedReducer(undefined, action);
  }
  return combinedReducer(state, action);
};
export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: false,
    serializableCheck: false
  }).concat(middleWares)
});

sagaMiddleware.run(rootSaga);
