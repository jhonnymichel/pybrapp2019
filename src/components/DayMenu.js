import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from 'app/styles';

const DayMenu = ({days, currentDay, scrollTo}) => (
  <View style={styles.dayMenu.container}>
    {Object.keys(days).map((day, index) => (
      <TouchableOpacity
        key={day}
        style={styles.dayMenu.button}
        disabled={!days[day].length}
        onPress={() => scrollTo(index)}>
        <Text
          style={
            days[day].length
              ? day == currentDay
                ? styles.dayMenu.textHighlight
                : styles.dayMenu.text
              : styles.dayMenu.textDisabled
          }>
          {day}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default DayMenu;
