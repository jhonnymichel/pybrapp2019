import React from 'react';
import {View, Text} from 'react-native';
import styles, {lightBlue} from 'app/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Location = ({children}) => (
  <View style={styles.location.container}>
    <Ionicons name="ios-pin" size={17} color={lightBlue} />
    <Text style={styles.location.text}>{children}</Text>
  </View>
);

export default Location;
