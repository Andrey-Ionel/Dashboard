import { Platform } from 'react-native';

export const PHONE_NUMBER_LENGTH = 10;

export const isIos = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const logError = (error: any) => console.log(error);

export const HIT_SLOP_AREA = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
};

export const ONLY_NUMBERS = /\D/g;
