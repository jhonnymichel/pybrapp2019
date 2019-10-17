import React from 'react';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';

class Debounce extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      initialValue: this.props.value,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.value, prevState.initialValue)) {
      return {value: nextProps.value, initialValue: nextProps.value};
    }

    return prevState;
  }

  applyChange = debounce(() => {
    const {value} = this.state;
    this.props.onChange(value);
  }, 300);

  onChange = v => {
    const value = v;
    this.setState(
      state => ({
        ...this.state,
        value,
      }),
      () => {
        if (value === '') {
          this.props.onChange(value);
        }

        this.applyChange();
      },
    );
  };

  render() {
    const {value} = this.state;
    return this.props.children(value, this.onChange);
  }
}

export default Debounce;
