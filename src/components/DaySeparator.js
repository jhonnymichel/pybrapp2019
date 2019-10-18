import React from 'react';
import {Text, View} from 'react-native';
import {getDayLabel} from 'app/utils';
import styles from 'app/styles';

const DaySeparator = ({day, height}) => (
  <View style={{...styles.dateSeparator, height}}>
    <Text style={styles.dateSeparatorText}>
      Dia {day} – <Text>{getDayLabel(day)}</Text>
    </Text>
    <View style={styles.dateSeparatorLine} />
  </View>
);

export default DaySeparator;
