import React from 'react';
import { Text, View } from 'react-native';
// import Loading from 'img/loading.svg';

const EmptyList = ({ message }) => (
  <View className="empty-list">
    {/* <img src={Loading} alt="Lista vazia" width="75px" height="auto"/> */}
    <Text className="empty-message--small">
      { message }
    </Text>
  </View>
);

export default EmptyList;
