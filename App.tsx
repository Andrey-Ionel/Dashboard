import React from 'react';
import { StatusBar } from 'react-native';

import { Provider } from 'react-redux';
import store from './src/store';
import { Navigation } from './src/components/Navigation';
import { AuthProvider } from './src/context/AuthContext';

import { isAndroid } from './src/lib/constants';
import colors from './src/styles/colors';
const App: () => React.ReactNode = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        {isAndroid && <StatusBar backgroundColor={colors.backgroundPrimary} />}
        <Navigation />
      </AuthProvider>
    </Provider>
  );
};

export default App;
