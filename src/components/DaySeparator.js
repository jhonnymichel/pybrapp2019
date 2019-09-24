import React from 'react';
import { Text, View } from 'react-native';
import { getDayLabel } from 'app/utils';

const DaySeparator = ({ day }) => (
  <View>
    <Text>
      Dia {day} – <Text>{getDayLabel(day)}</Text>
    </Text>
  </View>
);

export default DaySeparator;
