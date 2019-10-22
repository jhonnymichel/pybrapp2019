import React from 'react';
import {BlurView} from '@react-native-community/blur';
import styles from 'app/styles';

export default () => (
  <BlurView style={styles.absolute} blurType="light" blurAmount={5} />
);
