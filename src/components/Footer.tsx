import React, { FC } from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { HIT_SLOP_AREA } from '../lib/constants';
import colors from '../styles/colors';
import { fonts } from '../styles/fonts';

const styles = StyleSheet.create({
  divider: {
    height: 2,
    width: '100%',
    backgroundColor: colors.dividerBackground,
  },
  rowContainer: {
    margin: 20,
    flexDirection: 'row',
  },
  haveAccountText: {
    fontFamily: fonts.gotham,
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  linkText: {
    fontFamily: fonts.gotham,
    color: colors.link,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

interface FooterProps {
  onPress: (event: GestureResponderEvent) => void;
  text: string;
  linkText: string;
}

export const Footer: FC<FooterProps> = ({ onPress, text, linkText }) => {
  return (
    <>
      <View style={styles.divider} />
      <View style={styles.rowContainer}>
        <Text style={styles.haveAccountText}>{text}</Text>
        <TouchableOpacity hitSlop={HIT_SLOP_AREA} onPress={onPress}>
          <Text style={styles.linkText}>{linkText}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
