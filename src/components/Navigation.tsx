import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInContainer from '../containers/SignInContainer';
import JoinNowContainer from '../containers/JoinNowContainer';
import HomeContainer from '../containers/HomeContainer';

export const Navigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Weather'}>
        <Stack.Screen
          name="SignIn"
          component={SignInContainer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JoinNow"
          component={JoinNowContainer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeContainer}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
