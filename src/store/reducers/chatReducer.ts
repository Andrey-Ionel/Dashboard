import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxMessagesData, SocketMessage } from '../types';

const initialState: ReduxMessagesData = {
  messages: [],
  error: '',
};

const chatReducer = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    getMessagesSuccess(state, { payload }: PayloadAction<SocketMessage[]>) {
      state.messages = payload as SocketMessage[];
    },
    addNewMessages(state, { payload }: PayloadAction<SocketMessage[]>) {
      state.messages = payload as SocketMessage[];
    },
    deleteUserMessage(state, { payload }: PayloadAction<string>) {
      state.messages = state.messages.filter(
        message => message.messageId !== payload,
      );
    },
    getError(state, { payload }: PayloadAction<string>) {
      state.error = payload as string;
    },
  },
});

export const getMessagesAction = createAction('messages/getMessages');
export const addMessagesAction = createAction<SocketMessage[]>(
  'messages/addMessages',
);
export const deleteMessageAction = createAction<string>(
  'messages/deleteMessage',
);

export const {
  getMessagesSuccess,
  addNewMessages,
  deleteUserMessage,
  getError,
} = chatReducer.actions;
export default chatReducer.reducer;
