import React from 'react';
import Switch from 'react-switchery';

export const FilterCheckbox = ({ checked, onChange, label, ...props }) => (
  <div className="schedule_category" { ...props }>
    <label>
      {` ${label}`}
    </label>
    <Switch
      checked={checked}
      onChange={onChange}
    />
  </div>
)

export const EventTypeFilter = ({ types, onChange, filter }) => (
  <div className="category-filter">
    {types.map(type => (
      <FilterCheckbox
        checked={filter.includes(type)}
        onChange={() => onChange(type)}
        label={type}
        key={type}
      />
    ))}
  </div>
)

export const CategoryFilter = ({ categories, onChange, filter }) => (
  <div className="category-filter">
    {categories.map(category => (
      <FilterCheckbox
        checked={filter.includes(category)}
        key={category}
        onChange={() => onChange(category)}
        label={category}
      />
    ))}
  </div>
)

export class FilterBox extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }

  clearFilter() {
    this.props.onChange({
      target: {
        value: '',
      }
    })
    this.input.blur();
  }

  onSubmit(e) {
    e.preventDefault();
    this.input.blur();
  }

  render() {
    const { value, onChange, onClick } = this.props;
    return (
        <div className="filter-box">
          <form onSubmit={this.onSubmit} className="filters-search">
            <i aria-hidden="true" className="material-icons search-icon">search</i>
            <input
              ref={input => this.input = input}
              value={value}
              onChange={onChange}
              placeholder="Pesquisar palestra, autor..."
              />
              {value &&
                <button type="button" onClick={this.clearFilter} className="filters-button--small close-button">
                  <i className="material-icons">close</i>
                </button>
              }
          </form>
          <button type="button" onClick={onClick} className="filters-button">
            <i className="material-icons">filter_list</i>
          </button>
      </div>
     );
   }
}

