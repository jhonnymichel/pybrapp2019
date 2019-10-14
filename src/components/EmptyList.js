import React from 'react';
import {Text, View} from 'react-native';
import styles from 'app/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {darkestBlue} from '../styles';
// import Loading from 'img/loading.svg';

const EmptyList = ({message}) => (
  <View style={styles.emptyList.container}>
    <Ionicons name="ios-calendar" size={200} color={darkestBlue} />
    <Text style={styles.emptyList.text}>{message}</Text>
  </View>
);

export default EmptyList;
