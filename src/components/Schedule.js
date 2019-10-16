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
    getSectionHeaderHeight: () => this.context.sectionHeaderHeight, // The height of your section headers
    listHeaderHeight: this.context.listHeaderHeights[this.props.currentPage],
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
    console.log(store);
    const days = map(store.days, (data, title) => ({
      title,
      data,
    }));
    const errorMessage =
      store.isListEmpty ||
      store.isError ||
      (this.props.currentPage === 'myListPage' && store.favorites.length);

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
        <View style={styles.schedulePage.scrollView}>
          {this.props.currentPage === 'myListPage' &&
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
                <View style={styles.tableHeader.wrapper}>
                  <View style={styles.tableHeader.container}>
                    <Text style={styles.tableHeader.text}>
                      {store.listHeaderTexts[this.props.currentPage]}
                    </Text>
                  </View>
                </View>
              }
              ListFooterComponent={
                <View style={styles.tableHeader.wrapper}>
                  <View style={styles.tableHeader.container}>
                    <Text style={styles.tableHeader.text}>
                      Programação sujeita a alterações sem aviso prévio.
                    </Text>
                  </View>
                </View>
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
