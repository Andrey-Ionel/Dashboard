import React, { FC, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Header } from './Header';
import { ScreenWrapper } from './ScreenWrapper';
import { AuthContext } from '../context/AuthContext';
import { Loading } from './Loading';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { NotificationModal } from '../modals/NotificationModal';

import i18n from '../lib/translations';
import { fonts } from '../styles/fonts';
import colors from '../styles/colors';
import { HIT_SLOP_AREA, isIos, logError } from '../lib/constants';

export interface HomeProps {
  navigation: NavigationProp<ParamListBase>;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  btn: {
    borderRadius: 0,
    backgroundColor: colors.backgroundPrimary,
    padding: 15,
    lineHeight: 22,
    fontSize: 18,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    alignSelf: 'center',
  },
  btnText: {
    fontSize: 18,
    fontFamily: fonts.ghotamBlack,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});

export const Home: FC<HomeProps> = ({ navigation }) => {
  const { logOut, loading, userInfo, notification, setNotification } =
    useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const needOpen = false;
  const notificationImage = isIos
    ? notification?.ios?.badge
    : notification?.android?.imageUrl;

  useEffect(() => {
    if (needOpen) {
      addPhoto().catch(e => logError(e));
    }
    getUserData().catch(e => logError(e));
  }, []);

  useEffect(() => {
    if (notification?.title?.length) {
      setModalVisible(true);
    }
  }, [notification?.title?.length]);

  const options = {
    mediaType: 'photo' as MediaType,
    quality: 1,
    allowsEditing: true,
  };

  const closeModal = () => {
    setModalVisible(false);
    setNotification(undefined);
  };

  const addPhoto = async () => {
    let result: ImagePickerResponse;
    result = await launchImageLibrary(options as ImageLibraryOptions);
    console.log("'zxc', 'result'", result);
  };

  const getUserData = async () => {
    const user: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData> =
      await firestore().collection('users').doc(userInfo?.uid).get();
    setUserName(user?.data()?.nickname);
  };

  const logoutUser = () => {
    logOut?.(navigation);
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <ScreenWrapper
      screenStyle={styles.flex}
      needInSafeArea={true}
      fixedComponentTop={<Header title={'welcome'} name={userName} />}>
      {!!modalVisible && (
        <NotificationModal
          title={notification?.title || ''}
          subtitle={notification?.body || ''}
          image={notificationImage || ''}
          modalVisible={modalVisible}
          closeModal={closeModal}
        />
      )}
      <TouchableOpacity
        onPress={logoutUser}
        style={styles.btn}
        hitSlop={HIT_SLOP_AREA}>
        <Text style={styles.btnText}>{i18n.t('home.logout')}</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};
