import React, { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Image from 'react-native-fast-image';

import i18n from '../lib/translations';
import colors from '../styles/colors';
import { fonts } from '../styles/fonts';

import backArrow from '../assets/icons/backArrow.png';

interface HeaderProps {
  title: string;
  name?: string;
  goBack?: () => void;
  backButton?: boolean;
}

export const headerStyles = StyleSheet.create({
  header: {
    height: 40,
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
  imageContainer: {
    position: 'absolute',
    left: 15,
  },
  backArrow: {
    width: 22,
    height: 18,
  },
});

export const Header: FC<HeaderProps> = ({
  title,
  name,
  goBack,
  backButton,
}) => {
  return (
    <View style={headerStyles.header}>
      {backButton && (
        <TouchableOpacity onPress={goBack} style={headerStyles.imageContainer}>
          <Image style={headerStyles.backArrow} source={backArrow} />
        </TouchableOpacity>
      )}
      <Text style={headerStyles.title}>
        {i18n.t(`header.${title}`) + `${name?.length ? name : ''}`}
      </Text>
    </View>
  );
};
