import { FC } from 'react';
import { Chat } from '../components/Chat';
import { connect } from 'react-redux';
import { SocketMessage } from '../store/types';

const mapStateToProps = (state: any) => {
  return {
    messages: state.chatReducer.messages as SocketMessage[],
    error: state.chatReducer.error as string,
  };
};

export default connect(mapStateToProps)(Chat as FC);
