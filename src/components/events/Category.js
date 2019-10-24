import React from 'react';
import {View, Text} from 'react-native';
import styles from 'app/styles';

const Category = ({event}) =>
  event.details.category ? (
    <View style={styles.flexOne}>
      <View
        style={
          styles.categories[
            event.details.category.toLowerCase().replace(/\s/g, '-')
          ] || styles.categories.default
        }
      >
        <Text style={styles.categories.text}>{event.details.category}</Text>
      </View>
    </View>
  ) : null;

export default Category;
