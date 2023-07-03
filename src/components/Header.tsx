import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import i18n from '../lib/translations';
import colors from '../styles/colors';
import { fonts } from '../styles/fonts';

interface HeaderProps {
  title: string;
}

const styles = StyleSheet.create({
  header: {
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: fonts.ghotamBold,
    fontSize: 22,
    lineHeight: 22,
    letterSpacing: 1,
    color: colors.textPrimary,
  },
});

export const Header: FC<HeaderProps> = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{i18n.t(`signInSection.${title}`)}</Text>
    </View>
  );
};
