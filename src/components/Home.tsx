import React, { FC, useContext, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

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
import { Button } from './Button';
import Image from 'react-native-fast-image';

import i18n from '../lib/translations';
import { fonts } from '../styles/fonts';
import colors from '../styles/colors';
import { logError } from '../lib/constants';

import chatIcon from '../assets/icons/chatIcon.png';

export interface HomeProps {
  navigation: NavigationProp<ParamListBase>;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  btn: {
    borderRadius: 0,
    backgroundColor: colors.backgroundPrimary,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: '100%',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: fonts.ghotamBlack,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  chatBtn: {
    height: 60,
    width: 60,
    alignSelf: 'flex-end',
    borderWidth: 3,
    borderRadius: 30,
    borderColor: colors.backgroundPrimary,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatImage: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
  },
});

export const Home: FC<HomeProps> = ({ navigation }) => {
  const { logOut, loading, userInfo } = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const needOpen = false;

  useEffect(() => {
    if (needOpen) {
      addPhoto().catch(e => logError(e));
    }
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      const user: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData> =
        await firestore()?.collection('users')?.doc(userInfo?.uid)?.get();
      setUserName(user?.data()?.nickname);
    };
    getUserData().catch(e => logError(e));
  }, [userInfo?.uid, userName]);

  const options = {
    mediaType: 'photo' as MediaType,
    quality: 1,
    allowsEditing: true,
  };

  const addPhoto = async () => {
    const result: ImagePickerResponse = await launchImageLibrary(
      options as ImageLibraryOptions,
    );
    console.log("'zxc', 'result'", result);
  };

  const logoutUser = () => {
    logOut?.();
  };

  const goToChat = () => {
    navigation.navigate('Chat');
  };

  const renderBottomContent = () => {
    return (
      <>
        <TouchableOpacity onPress={goToChat} style={styles.chatBtn}>
          <Image source={chatIcon} style={styles.chatImage} />
        </TouchableOpacity>
        <Button
          title={i18n.t('home.logout')}
          onPress={logoutUser}
          btnStyle={styles.btn}
          textStyle={styles.btnText}
        />
      </>
    );
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <ScreenWrapper
      screenStyle={styles.flex}
      needInSafeArea={true}
      fixedComponentTop={<Header title={'welcome'} name={userName} />}
      fixedComponentBottom={renderBottomContent()}>
      <View />
    </ScreenWrapper>
  );
};
