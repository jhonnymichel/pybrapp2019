import React from 'react';
import { View, Text, ScrollView, Button } from 'react-native'
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import classNames from 'classnames';
// import DayMenu from './DayMenu';
import DaySeparator from './DaySeparator';
// import ScrollNavigation from 'scroll-navigation-menu';
import Events from './Events';
// import Transition from 'react-transition-group/Transition';
import EmptyList from './EmptyList';
import { getFormattedTime } from 'app/utils';
import styles from 'app/styles';
// import { FilterBox, CategoryFilter, EventTypeFilter } from './filters';

class Schedule extends React.Component {
  renderDay(day, label) {
    if (day.length) {
      return (
        <View id={`day${label}`} >
          <DaySeparator day={label}/>
          {day.map(events => (
            <Events
              favorites={this.props.store.favorites}
              scheduleInDate={events}
              toggleFavorite={this.props.store.actions.toggleFavorite}
              key={getFormattedTime(events.date)}
            />
          ))}
        </View>
      )
    }
  }

  componentWillUnmount() {
    console.log('vai desmontar');
  }

  componentDidMount() {
    console.log('montando');
    this.amountOfDays = 0;
    if (this.props.store.days) {
      for (let key in this.props.store.days) {
        this.amountOfDays += this.props.store.days[key].length;
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.store.days && this.props.currentPage!=='my-schedule') {
      let items = 0;
      for (let key in this.props.store.days) {
        items += this.props.store.days[key].length;
      }

      if (items !== this.amountOfDays) {
        this.amountOfDays = items;
        // this.anchors.scrollTo('.schedule-page');
      }
    }
  }

  render() {
    const { store } = this.props;
    return (
      <React.Fragment>
        {/* <View className="filters-container">
          <View
            className="filters"
          >
            <DayMenu days={store.days} />
            <FilterBox
              animationState={ animationState }
              value={store.searchFilter}
              onClick={store.actions.toggleAdvancedFilters}
              onChange={store.actions.onSearchFilterChange}
              isPopoverOpened={store.isShowingAdvancedFilters}
            >
            </FilterBox>
          </View>
          <View className="advanced-filters" aria-hidden={!store.isShowingAdvancedFilters} aria-modal="true" style={{
            ...this.filtersStyles.default,
            ...this.filtersStyles[animationState]
          }}> */}
            {/* <View className="app-bar">
              <Button
                onClick={store.actions.toggleAdvancedFilters}
                className="back-button"
              >
                <Text className="material-icons">arrow_back_ios</Text>
              </Button>
              <Text>Filtrar</Text>
            </View> */}
            {/* <View className="advanced-filters-wrapper">
              <Text>Categoria</Text>

              <CategoryFilter
                categories={store.talksCategories}
                filter={store.categoryFilter}
                onChange={store.actions.onCategoryFilterChange}
              />
              <Text>Tipo</Text>
              <EventTypeFilter
                types={store.eventTypes}
                filter={store.typeFilter}
                onChange={store.actions.onTypeFilterChange}
              />
            </View> */}
          {/* </View>
        </View> */}
        <ScrollView>
          <Text className="empty-message--small">
            { this.props.currentPage === 'schedule' ?
                (!store.isListEmpty && <Text> Toque em um evento para adicioná-lo as suas marcações e receber notificações. </Text>) :
                (store.favorites.length && <Text> Toque em um evento para removê-lo de sua lista e cancelar notificações. </Text>)
            }
          </Text>
          {this.props.currentPage === 'my-schedule' && !store.favorites.length && <EmptyList message="Você ainda não marcou nenhuma palestra. Na aba Palestras você pode fazer isso."/>}
          {store.isListEmpty && <EmptyList message="Nenhum resultado encontrado. Altere os termos de sua pesquisa e cheque os filtros aplicados."/>}
          {store.isError && <EmptyList message="Houve um problema ao carregar os dados. Verifique sua conexão com a internet"/>}
          {!store.isError && map(store.days, (day, label) => (
            <React.Fragment key={label}>
              {this.renderDay(day, label)}
            </React.Fragment>
            ))}
          <Text className="schedule_subtitle" style={{marginBottom: 100}}>
            * Programação sujeita a alteração sem aviso prévio *
          </Text>
        </ScrollView>
    </React.Fragment>

    )
  }
}

export default Schedule;
