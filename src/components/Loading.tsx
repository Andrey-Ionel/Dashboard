import React, { FC } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { ScreenWrapper } from './ScreenWrapper';

import colors from '../styles/colors';

export const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  screenContainer: {
    minHeight: screenHeight,
    paddingBottom: 40,
  },
  loadingContainer: {
    height: screenHeight - 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const Loading: FC = () => {
  return (
    <LinearGradient colors={colors.systemBackgroundGradient}>
      <ScreenWrapper
        screenStyle={styles.screenContainer}
        needInSafeArea={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} />
        </View>
      </ScreenWrapper>
    </LinearGradient>
  );
};
