import AsyncStorage from '@react-native-async-storage/async-storage';
import { logError } from './constants';

export enum AsyncStorageKeys {
  credentials = 'credentials',
}

export const setStorageValue = async (key: AsyncStorageKeys, value: any) => {
  let storageValue: string;
  if (typeof value === 'object') {
    storageValue = JSON.stringify(value);
  } else if (typeof value === 'number') {
    storageValue = value.toString();
  } else if (typeof value === 'boolean') {
    storageValue = `${value}`;
  } else if (typeof value === 'string') {
    storageValue = value;
  } else {
    throw new Error(
      'Unsupported value. add normalizer to src/lib/asyncStorage.ts',
    );
  }
  try {
    await AsyncStorage.setItem(key, storageValue);
  } catch (e) {
    logError(e as Error);
  }
};

export const getStorageValue = async (
  key: AsyncStorageKeys,
): Promise<string | undefined> => {
  const storageValue = await AsyncStorage.getItem(key);
  if (!storageValue) {
    return;
  }

  return storageValue;
};

export const removeStorageValue = async (): Promise<void> => {
  await AsyncStorage.removeItem(AsyncStorageKeys.credentials);
};
