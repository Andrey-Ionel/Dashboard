module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '^use.+(Callback)$',
      },
    ],
  },
};
