import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  Button,
} from 'react-native';
import styles, {darkBlue, lightBlue, white} from 'app/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Debounce from 'app/components/Debounce';
import Background from './Background';

export const FilterBox = ({value, onChange, onClick}) => (
  <View style={styles.filters.container}>
    <View style={styles.filters.inputContainer}>
      <View style={styles.filters.searchIcon}>
        <Ionicons name="ios-search" size={18} color={darkBlue} />
      </View>
      <Debounce value={value} onChange={onChange}>
        {(value, onChange) => (
          <TextInput
            placeholder="Pesquise palestras, autores..."
            placeholderTextColor={`${lightBlue}AA`}
            style={styles.filters.input}
            onChangeText={onChange}
            value={value}
            clearButtonMode="always"
          />
        )}
      </Debounce>
    </View>
    <View>
      <TouchableOpacity onPress={onClick} style={styles.filters.button}>
        <Ionicons name="ios-options" size={28} color={darkBlue} />
      </TouchableOpacity>
    </View>
  </View>
);

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

class EventTypeFilter extends React.PureComponent {
  onChange = (type, filter) => {
    if (filter.includes(type)) {
      return filter.filter(t => t !== type);
    }

    return [...filter, type];
  };

  render() {
    const {types, onChange, filter} = this.props;
    return (
      <Debounce value={filter} onChange={onChange}>
        {(filter, onChange) => (
          <View style={styles.filtersModal.group}>
            {types.map(type => (
              <FilterCheckbox
                checked={filter.includes(type)}
                onChange={() => onChange(this.onChange(type, filter))}
                label={type}
                key={type}
              />
            ))}
          </View>
        )}
      </Debounce>
    );
  }
}
class CategoryFilter extends React.PureComponent {
  onChange = (category, filter) => {
    if (filter.includes(category)) {
      return filter.filter(c => c !== category);
    }

    return [...filter, category];
  };

  render() {
    const {categories, onChange, filter} = this.props;
    return (
      <Debounce value={filter} onChange={onChange}>
        {(filter, onChange) => (
          <View style={styles.filtersModal.group}>
            {categories.map(category => (
              <FilterCheckbox
                checked={filter.includes(category)}
                key={category}
                onChange={() => onChange(this.onChange(category, filter))}
                label={category}
              />
            ))}
          </View>
        )}
      </Debounce>
    );
  }
}

export const FilterModal = ({visible, onRequestClose, store}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onRequestClose}
  >
    <View style={styles.filtersModal.wrapper}>
      <View style={{...styles.filtersModal.container, zIndex: 999}}>
        <Text style={styles.filtersModal.text}>Categorias de palestras</Text>
        <CategoryFilter
          categories={store.talksCategories}
          filter={store.categoryFilter}
          onChange={store.actions.onCategoryFilterChange}
        />
        <Text style={styles.filtersModal.text}>Tipos de evento</Text>
        <EventTypeFilter
          types={store.eventTypes}
          filter={store.typeFilter}
          onChange={store.actions.onTypeFilterChange}
        />
        <View style={styles.filtersModal.footer}>
          <Button title="Ok" color={white} onPress={onRequestClose} />
        </View>
      </View>
      <Background />
    </View>
  </Modal>
);
