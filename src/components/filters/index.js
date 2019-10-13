import React from 'react';
import {View, TextInput, TouchableOpacity, Text} from 'react-native';
import styles, {white} from 'app/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';

export class FilterBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {value, onChange, onClick} = this.props;

    return (
      <View style={styles.filters.container}>
        <View style={styles.filters.searchIcon}>
          <Ionicons name="ios-search" size={20} color={white} />
        </View>
        <View style={styles.filters.inputContainer}>
          <TextInput
            placeholder="Pesquise palestras, autores..."
            placeholderTextColor="#777"
            style={styles.filters.input}
            onChangeText={onChange}
            value={value}
          />
        </View>
        <View>
          <TouchableOpacity style={styles.filters.button}>
            <Ionicons name="ios-options" size={25} color={white} />
            <Text style={styles.filters.buttonText}>Filtros</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
