import React from 'react';
import {View, Text, ScrollView, Button} from 'react-native';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import DayMenu from './DayMenu';
import DaySeparator from './DaySeparator';
// import ScrollNavigation from 'scroll-navigation-menu';
import Events from './Events';
// import Transition from 'react-transition-group/Transition';
import EmptyList from './EmptyList';
import {getFormattedTime} from 'app/utils';
import {StoreContext} from '../Store';
import styles from 'app/styles';
import SafeAreaView from 'react-native-safe-area-view';
import {SectionList} from 'react-native';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import {FilterBox, FilterModal} from './filters';
import {white} from '../styles';
// import { FilterBox, CategoryFilter, EventTypeFilter } from './filters';

class Schedule extends React.Component {
  static contextType = StoreContext;
  sectionList = React.createRef({});
  state = {isFilterModalOpen: false};

  renderDay = events => {
    return (
      <Events
        favorites={this.context.favorites}
        scheduleInDate={events.item}
        toggleFavorite={this.context.actions.toggleFavorite}
      />
    );
  };

  changeHighlightedDay = ({viewableItems}) => {
    const {isListEmpty} = this.context;
    if (isListEmpty) {
      return;
    }
    let lastItem = viewableItems.pop();
    let currentDay;
    while (true) {
      if (!lastItem) {
        return;
      }
      currentDay = lastItem.section.title;
      if (lastItem.section.data.length) {
        break;
      }

      lastItem = viewableItems.pop();
    }
    if (currentDay !== this.state.currentDay) {
      this.setState({
        currentDay: lastItem.section.title,
      });
    }
  };

  getItemLayout = sectionListGetItemLayout({
    // The height of the row with rowData at the given sectionIndex and rowIndex
    getItemHeight: (rowData, sectionIndex, rowIndex) =>
      rowData.events.reduce((height, event) => event.layout.height + height, 0),

    // These four properties are optional
    getSectionHeaderHeight: () => 156, // The height of your section headers
    listHeaderHeight: 34,
  });

  scrollTo = sectionIndex => {
    const scrollTo = this.sectionList.current.scrollToLocation;
    if (scrollTo) {
      this.sectionList.current.scrollToLocation({sectionIndex, itemIndex: 0});
    }
  };

  toggleAdvancedFilters = () => {
    this.setState(state => ({
      isFilterModalOpen: !state.isFilterModalOpen,
    }));
  };

  render() {
    const store = this.context;
    const days = map(store.days, (data, title) => ({
      title,
      data,
    }));
    const errorMessage =
      store.isListEmpty ||
      store.isError ||
      (this.props.currentPage === 'my-schedule' && store.favorites.length);

    return (
      <SafeAreaView style={styles.schedulePage.container}>
        <View style={styles.schedulePage.header}>
          <DayMenu
            days={store.days}
            currentDay={this.state.currentDay}
            scrollTo={this.scrollTo}
          />
          <FilterBox
            value={store.searchFilter}
            onClick={this.toggleAdvancedFilters}
            onChange={store.actions.onSearchFilterChange}
            isPopoverOpened={store.isShowingAdvancedFilters}
          />
        </View>
        <FilterModal
          store={store}
          visible={this.state.isFilterModalOpen}
          onRequestClose={this.toggleAdvancedFilters}
        />
        {/* <View className="filters-container">
          <View
            className="filters"
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
        <View style={styles.schedulePage.scrollView}>
          {this.props.currentPage === 'my-schedule' &&
            !store.favorites.length && (
              <EmptyList message="Você ainda não marcou nenhuma palestra. Na aba Palestras você pode fazer isso." />
            )}
          {store.isListEmpty && (
            <EmptyList message="Nenhum resultado encontrado. Altere os termos de sua pesquisa e cheque os filtros aplicados." />
          )}
          {store.isError && (
            <EmptyList message="Houve um problema ao carregar os dados. Verifique sua conexão com a internet" />
          )}
          {!errorMessage && (
            <SectionList
              sections={days}
              ref={this.sectionList}
              initialNumToRender={2}
              renderItem={this.renderDay}
              onViewableItemsChanged={this.changeHighlightedDay}
              getItemLayout={this.getItemLayout}
              renderSectionHeader={({section: {data, title}}) =>
                data.length ? <DaySeparator key={title} day={title} /> : null
              }
              ListHeaderComponent={
                <Text>
                  {this.props.currentPage === 'schedule'
                    ? !store.isListEmpty && (
                        <Text>
                          {' '}
                          Toque em um evento para adicioná-lo as suas marcações
                          e receber notificações.{' '}
                        </Text>
                      )
                    : store.favorites.length && (
                        <Text>
                          {' '}
                          Toque em um evento para removê-lo de sua lista e
                          cancelar notificações.{' '}
                        </Text>
                      )}
                </Text>
              }
              ListFooterComponent={
                <Text className="schedule_subtitle" style={{marginBottom: 100}}>
                  * Programação sujeita a alteração sem aviso prévio *
                </Text>
              }
              stickySectionHeadersEnabled={false}
              keyExtractor={events => getFormattedTime(events.date)}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

export default Schedule;
