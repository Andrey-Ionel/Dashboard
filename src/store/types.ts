export interface SocketMessage {
  senderId: string;
  messageId: string;
  message: string;
  date: string;
}

export interface ReduxMessagesData {
  messages: SocketMessage[];
  error: string;
}
