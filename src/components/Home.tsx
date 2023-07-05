import React, { FC, useContext, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Header } from './Header';
import { ScreenWrapper } from './ScreenWrapper';
import { AuthContext } from '../context/AuthContext';
import { Loading } from './Loading';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

import i18n from '../lib/translations';
import { fonts } from '../styles/fonts';
import colors from '../styles/colors';
import { HIT_SLOP_AREA, logError } from '../lib/constants';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';

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
  const { logOut, loading } = useContext(AuthContext);

  useEffect(() => {
    addPhoto().catch(e => logError(e));
  }, []);

  const options = {
    mediaType: 'photo' as MediaType,
    quality: 1,
    allowsEditing: true,
  };

  const addPhoto = async () => {
    let result: ImagePickerResponse;
    result = await launchImageLibrary(options as ImageLibraryOptions);
    console.log("'zxc', 'result'", result);
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
      fixedComponentTop={<Header title={'home'} />}>
      <TouchableOpacity
        onPress={logoutUser}
        style={styles.btn}
        hitSlop={HIT_SLOP_AREA}>
        <Text style={styles.btnText}>{i18n.t('home.logout')}</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};
