import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenWrapper } from './ScreenWrapper';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import colors from '../styles/colors';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});

export interface ChatProps {
  navigation: NavigationProp<ParamListBase>;
}

export const Chat: FC<ChatProps> = () => {
  return (
    <ScreenWrapper screenStyle={styles.flex} needInSafeArea={true}>
      <View />
    </ScreenWrapper>
  );
};
