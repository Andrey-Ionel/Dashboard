import React, { Context, createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { User } from '../components/joinNow';

import { NavigationProp, ParamListBase } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

import {
  AsyncStorageKeys,
  getStorageValue,
  removeStorageValue,
  setStorageValue,
} from '../lib/asyncStorage';
import { logError } from '../lib/constants';
import i18n from 'i18next';

export const AuthContext: Context<any> = createContext({});
export const AuthProvider = ({ children }: any) => {
  const [userInfo, setUserInfo] = useState<User | {}>({});
  const [loading, setLoading] = useState<boolean>(false);
  const usersCollection = firestore()?.collection('users');

  const firebaseConfig = {
    apiKey: 'AIzaSyDgk_ZLfGXU_wCHoyqF9VHS51FEDiATdzA',
    authDomain: 'dashboard-6ecae.firebaseapp.com',
    projectId: 'dashboard-6ecae',
    storageBucket: 'dashboard-6ecae.appspot.com',
    messagingSenderId: '814351911525',
    appId: '1:814351911525:web:6e6d1c33cb32ccf8f0548c',
    measurementId: 'G-ZMH93WSLGY',
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig).catch(e => logError(e));
  }

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      messaging()
        .getToken()
        .then(token => {
          console.log("'zxc', 'token'", token);
        });
      console.log('Authorization status:', authStatus);
    } else {
      logError('Failed token status');
    }
  };

  useEffect(() => {
    isLoggedIn().catch(e => logError(e));
    requestUserPermission().catch(e => logError(e));

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          Alert.alert(
            'Notification caused app to open from quit state:',
            JSON.stringify(remoteMessage.notification),
          );
        }
      });

    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp(async remoteMessage => {
      Alert.alert(
        'Notification caused app to open from background state:',
        JSON.stringify(remoteMessage.notification),
      );
    });

    // setAppMessaging().catch(e => logError(e));

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
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
        setUserInfo({});
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
      value={{ login, createNewAccount, logOut, loading, userInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
