import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from 'app/styles';

const DayMenu = ({ days, scrollTo }) => (
  <View style={styles.dayMenu.container}>
    {Object.keys(days).map((day, index) => (
      <TouchableOpacity key={day} style={styles.dayMenu.button}
        onPress={() => scrollTo(index)}
      >
        <Text style={styles.dayMenu.text}>
          {day}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default DayMenu;
