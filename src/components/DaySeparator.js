import React from 'react';
import { Text, View } from 'react-native';
import { getDayLabel } from 'app/utils';
import styles from 'app/styles';

const DaySeparator = ({ day }) => (
  <View style={styles.dateSeparator}>
    <Text style={styles.dateSeparatorText}>
      Dia {day} – <Text>{getDayLabel(day)}</Text>
    </Text>
  </View>
);

export default DaySeparator;
