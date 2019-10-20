module.exports = {
  project: {
    ios: {},
    android: {}, // grouped into "project"
  },
  dependencies: {
    '@react-native-community/blur': {
      platforms: {
        android: null,
      },
    },
  },
  assets: ['./assets/img/'], // stays the same
};
