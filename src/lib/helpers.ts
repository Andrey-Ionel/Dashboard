import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

export const getPushData = async (
  message: FirebaseMessagingTypes.RemoteMessage,
) => {
  PushNotification?.localNotification({
    channelId: 'channel-id',
    title: message?.notification?.title,
    message: message?.notification?.body || '',
  });
};
