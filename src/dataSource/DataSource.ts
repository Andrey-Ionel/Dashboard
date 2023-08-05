import axios from 'axios';
import { SocketMessage } from '../store/types';

export const getMessages = async (): Promise<SocketMessage[]> => {
  return await axios.get('https://9yfysp-8080.csb.app/').then(response => {
    return response?.data;
  });
};

export const deleteMessage = async (id: string): Promise<void> => {
  await axios.delete(`https://9yfysp-8080.csb.app/${id}`);
};
