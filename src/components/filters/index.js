import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  Button,
} from 'react-native';
import styles, {white} from 'app/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BlurView, VibrancyView} from '@react-native-community/blur';

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
            clearButtonMode="always"
          />
        </View>
        <View>
          <TouchableOpacity onPress={onClick} style={styles.filters.button}>
            <Ionicons name="ios-options" size={25} color={white} />
            <Text style={styles.filters.buttonText}>Filtros</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const FilterCheckbox = ({checked, onChange, label, ...props}) => (
  <View style={styles.filtersModal.checkboxContainer}>
    <TouchableOpacity
      onPress={onChange}
      style={
        checked
          ? styles.filtersModal.checkbox
          : styles.filtersModal.checkboxEmpty
      }
    >
      <Text
        style={
          checked
            ? styles.filtersModal.checkboxText
            : styles.filtersModal.checkboxTextEmpty
        }
      >
        {label}
      </Text>
    </TouchableOpacity>
  </View>
);

const EventTypeFilter = ({types, onChange, filter}) => (
  <View style={styles.filtersModal.group}>
    {types.map(type => (
      <FilterCheckbox
        checked={filter.includes(type)}
        onChange={() => onChange(type)}
        label={type}
        key={type}
      />
    ))}
  </View>
);

const CategoryFilter = ({categories, onChange, filter}) => (
  <View>
    {categories.map(category => (
      <FilterCheckbox
        checked={filter.includes(category)}
        key={category}
        onChange={() => onChange(category)}
        label={category}
      />
    ))}
  </View>
);

export const FilterModal = ({visible, onRequestClose, store}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onRequestClose}
  >
    <View style={styles.filtersModal.wrapper}>
      <View style={{...styles.filtersModal.container, zIndex: 999}}>
        {/* <Text>Categoria</Text>
      <CategoryFilter
        categories={store.talksCategories}
        filter={store.categoryFilter}
        onChange={store.actions.onCategoryFilterChange}
      /> */}
        <EventTypeFilter
          types={store.eventTypes}
          filter={store.typeFilter}
          onChange={store.actions.onTypeFilterChange}
        />
        <View style={styles.filtersModal.footer}>
          <Button title="Ok" onPress={onRequestClose} />
        </View>
      </View>
      <BlurView style={styles.absolute} blurType="light" blurAmount={5} />
    </View>
  </Modal>
);
