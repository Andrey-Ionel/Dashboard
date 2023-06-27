import React from 'react';
import { Text, View } from 'react-native';

import i18n from '../../lib/translations';
import { styles } from './styles';

export const SignInHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{i18n.t('signInSection.signIn')}</Text>
    </View>
  );
};
