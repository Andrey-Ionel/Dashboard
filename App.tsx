import React from 'react';
import { StatusBar } from 'react-native';

import { Navigation } from './src/components/Navigation';
import { AuthProvider } from './src/context/AuthContext';

import { isAndroid } from './src/lib/constants';
import colors from './src/styles/colors';

const App: () => React.ReactNode = () => {
  return (
    <AuthProvider>
      {isAndroid && <StatusBar backgroundColor={colors.backgroundPrimary} />}
      <Navigation />
    </AuthProvider>
  );
};

export default App;
