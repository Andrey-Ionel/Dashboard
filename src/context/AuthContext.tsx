import React, { Context, createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { User } from '../components/joinNow';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

import { NavigationProp, ParamListBase } from '@react-navigation/native';

import {
  AsyncStorageKeys,
  getStorageValue,
  removeStorageValue,
  setStorageValue,
} from '../lib/asyncStorage';
import { logError } from '../lib/constants';
import { getPushData } from '../lib/helpers';
import i18n from 'i18next';

interface AuthContext {
  login: (
    email: string,
    password: string,
    navigation: NavigationProp<ParamListBase>,
  ) => void;
  createNewAccount: (
    email: string,
    password: string,
    nickname: string,
    navigation: NavigationProp<ParamListBase>,
  ) => void;
  logOut: (navigation: NavigationProp<ParamListBase>) => void;
  loading: boolean;
  userInfo: User | undefined;
}

// @ts-ignore
export const AuthContext: Context<AuthContext> = createContext({});
export const AuthProvider = ({ children }: any) => {
  const [userInfo, setUserInfo] = useState<User | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const usersCollection = firestore()?.collection('users');

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      messaging()
        .getToken()
        .then(token => console.log(token));
    } else {
      logError('Failed token status');
    }
  };

  PushNotification.createChannel(
    {
      channelId: 'channel-id', // (required)
      channelName: 'My channel', // (required)
    },
    created => created, // (optional) callback returns whether the channel was created, false means it already existed.
  );

  useEffect(() => {
    isLoggedIn().catch(e => logError(e));
    requestUserPermission().catch(e => logError(e));

    // It's trigger notification when app foreground
    messaging().onMessage(getPushData);
  }, []);

  const createNewAccount = (
    email: string,
    password: string,
    nickname: string,
    navigation: NavigationProp<ParamListBase>,
  ): void => {
    setLoading(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(data => {
        usersCollection
          .doc(data?.user?.uid)
          .set({
            email: email,
            id: data?.user?.uid,
            nickname: nickname,
          })
          .then(() => {
            navigation.navigate('Home');
          });
        setUserInfo(data?.user);
        setStorageValue(AsyncStorageKeys.credentials, data?.user).catch(e =>
          logError(e),
        );
        setLoading(false);
      })
      .catch(error => {
        if (error?.code === 'auth/email-already-in-use') {
          setLoading(false);
          Alert.alert(i18n.t('errors.emailAlreadyInUse'));
        }

        if (error?.code === 'auth/invalid-email') {
          setLoading(false);
          Alert.alert(i18n.t('errors.emailInvalid'));
        }
        setLoading(false);
      });
  };

  const login = (
    email: string,
    password: string,
    navigation: NavigationProp<ParamListBase>,
  ): void => {
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(data => {
        setUserInfo(data?.user);
        setStorageValue(AsyncStorageKeys.credentials, data?.user).catch(e =>
          logError(e),
        );
        navigation.navigate('Home');
        setLoading(false);
      })
      .catch(error => {
        if (error?.code === 'auth/user-not-found') {
          setLoading(false);
          Alert.alert(i18n.t('errors.noSuchEmail'));
        }
        if (error?.code === 'auth/wrong-password') {
          setLoading(false);
          Alert.alert(i18n.t('errors.wrongPassword'));
        }
        if (error?.code === 'auth/invalid-email') {
          setLoading(false);
          Alert.alert(i18n.t('errors.emailInvalid'));
        }
        setLoading(false);
      });
  };

  const logOut = (navigation: NavigationProp<ParamListBase>): void => {
    setLoading(true);
    auth()
      .signOut()
      .then(() => {
        removeStorageValue().catch(e => logError(e));
        setUserInfo(undefined);
        navigation.navigate('SignIn');
        setLoading(false);
      })
      .catch(error => {
        logError(error?.message);
        setLoading(false);
      });
  };

  const isLoggedIn = async () => {
    try {
      setLoading(true);
      await getStorageValue(AsyncStorageKeys.credentials).then(
        async storageData => {
          if (storageData?.length) {
            setUserInfo(JSON.parse(storageData));
            setLoading(false);
          }
        },
      );
      setTimeout(() => setLoading(false), 1000);
    } catch (e) {
      logError(e);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        createNewAccount,
        logOut,
        loading,
        userInfo,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
