import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignInContainer from '../containers/SignInContainer';
import JoinNowContainer from '../containers/JoinNowContainer';
import HomeContainer from '../containers/HomeContainer';
import { PhoneAuth } from './PhoneAuth';
import { Chat } from './Chat';
import { AuthContext } from '../context/AuthContext';

import i18n from '../lib/translations';
import { headerStyles } from './Header';
import colors from '../styles/colors';

export const Navigation = () => {
  const Stack = createNativeStackNavigator();
  const { userInfo } = useContext(AuthContext);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userInfo?.uid ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeContainer}
              options={{ headerShown: false, orientation: 'portrait' }}
            />
            <Stack.Screen
              name="Chat"
              component={Chat}
              options={{ headerShown: false, orientation: 'portrait' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="SignIn"
              component={SignInContainer}
              options={{ headerShown: false, orientation: 'portrait' }}
            />
            <Stack.Screen
              name="PhoneAuth"
              component={PhoneAuth}
              options={{
                title: i18n.t('header.phoneAuthorisation'),
                headerTitleStyle: headerStyles.title,
                headerTintColor: colors.textPrimary,
                headerShadowVisible: false,
                statusBarColor: colors.textPrimary,
                orientation: 'portrait',
                headerTitleAlign: 'center',
              }}
            />
            <Stack.Screen
              name="JoinNow"
              component={JoinNowContainer}
              options={{ headerShown: false, orientation: 'portrait' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
