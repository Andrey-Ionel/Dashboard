import { configureStore, combineReducers } from '@reduxjs/toolkit';
import chatReducer from './reducers/chatReducer';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({ chatReducer });

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
