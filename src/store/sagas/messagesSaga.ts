import { deleteMessage, getMessages } from '../../dataSource/DataSource';
import { call, takeEvery, put } from 'redux-saga/effects';
import { SocketMessage } from '../types';
import {
  getMessagesSuccess,
  getError,
  addNewMessages,
  deleteUserMessage,
  getMessagesAction,
  addMessagesAction,
  deleteMessageAction,
} from '../reducers/chatReducer';
import { PayloadAction } from '@reduxjs/toolkit';

function* getMessagesRequest() {
  try {
    const messages: SocketMessage[] = yield call(getMessages);
    yield put(getMessagesSuccess(messages));
  } catch (error: any) {
    yield put(getError(error?.message));
  }
}

function* addMessageRequest({
  payload: messages,
}: PayloadAction<SocketMessage[]>) {
  yield put(addNewMessages(messages));
}

function* deleteMessageRequest({ payload: id }: PayloadAction<string>) {
  try {
    yield deleteMessage(id);
    yield put(deleteUserMessage(id));
  } catch (error: any) {
    yield put(getError(error?.message));
  }
}

export default function* watchMessages() {
  yield takeEvery(getMessagesAction.type, getMessagesRequest);
  yield takeEvery(addMessagesAction.type, addMessageRequest);
  yield takeEvery(deleteMessageAction.type, deleteMessageRequest);
}
