import React, { FC } from 'react';
import Image, { ImageStyle, Source } from 'react-native-fast-image';
import {
  GestureResponderEvent,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import { HIT_SLOP_AREA } from '../lib/constants';
import colors from '../styles/colors';

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  icon?: Source;
  btnStyle: ViewStyle;
  textStyle: TextStyle;
  imageStyle?: ImageStyle;
  disabled?: boolean;
}

export const Button: FC<ButtonProps> = ({
  title,
  onPress,
  icon,
  btnStyle,
  textStyle,
  imageStyle,
  disabled,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={HIT_SLOP_AREA}
      disabled={disabled}
      style={btnStyle}>
      {!!icon && <Image style={imageStyle} source={icon} />}
      <Text style={[textStyle, disabled && { color: colors.separatorPrimary }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
