import React from 'react';
import {View, Text, ScrollView, Button} from 'react-native';
import map from 'lodash/map';
import DayMenu from './DayMenu';
import DaySeparator from './DaySeparator';
import Events from './events';
import EmptyList from './EmptyList';
import {getFormattedTime} from 'app/utils';
import {StoreContext} from '../Store';
import styles from 'app/styles';
import SafeAreaView from 'react-native-safe-area-view';
import {SectionList} from 'react-native';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import {FilterBox, FilterModal} from './filters';
import throttle from 'lodash/throttle';

class Schedule extends React.Component {
  static contextType = StoreContext;
  sectionList = React.createRef({});
  state = {isFilterModalOpen: false};

  renderDay = events => {
    return (
      <Events
        openEventDetails={this.openEventDetails}
        timeWidth={this.context.timeWidth}
        currentPage={this.props.currentPage}
        favorites={this.context.favorites}
        scheduleInDate={events.item}
        toggleFavorite={this.context.actions.toggleFavorite}
        isLastItem={events.section.data.length - 1 === events.index}
      />
    );
  };

  openEventDetails = (event, date) => {
    const {navigation} = this.props;
    navigation.navigate('Details', {
      event,
      date,
    });
  };

  changeHighlightedDay = throttle(({viewableItems}) => {
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
  }, 100);

  getItemLayout = sectionListGetItemLayout({
    // The height of the row with rowData at the given sectionIndex and rowIndex
    getItemHeight: (rowData, sectionIndex, rowIndex) =>
      rowData.events.reduce((height, event) => event.layout.height + height, 0),

    // These four properties are optional
    getSectionHeaderHeight: id => {
      return this.context.days[Object.keys(this.context.days)[id]].length
        ? this.context.sectionHeaderHeight
        : 0; /// The height of your section headers
    },
    listHeaderHeight: this.context.learnedToFavorite
      ? 0
      : this.context.listHeaderHeights[this.props.currentPage],
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
    console.log('ae cassinao', this.props);
    const store = this.context;
    let days = store.days;
    if (this.props.currentPage === 'myListPage') {
      days = store.actions.getAllFavoriteEvents();
    }
    const daysForSectionView = map(days, (data, title) => ({
      title,
      data,
    }));
    const errorMessage = store.isListEmpty || store.isError;
    const noFavoritesSaved = !store.favorites.length;

    const listRenderConstraint =
      this.props.currentPage === 'schedulePage'
        ? errorMessage
        : noFavoritesSaved;

    return (
      <SafeAreaView style={styles.schedulePage.container}>
        <View style={styles.schedulePage.header}>
          <DayMenu
            days={days}
            currentDay={this.state.currentDay}
            scrollTo={this.scrollTo}
          />
          {this.props.currentPage === 'schedulePage' && (
            <FilterBox
              value={store.searchFilter}
              onClick={this.toggleAdvancedFilters}
              onChange={store.actions.onSearchFilterChange}
              isPopoverOpened={store.isShowingAdvancedFilters}
            />
          )}
        </View>
        {this.props.currentPage === 'schedulePage' && (
          <FilterModal
            store={store}
            visible={this.state.isFilterModalOpen}
            onRequestClose={this.toggleAdvancedFilters}
          />
        )}
        <View style={styles.schedulePage.scrollView}>
          {this.props.currentPage === 'myListPage' &&
            !store.favorites.length && (
              <EmptyList message="Você ainda não salvou nenhum evento à sua lista." />
            )}
          {this.props.currentPage === 'schedulePage' && store.isListEmpty && (
            <EmptyList message="Nenhum resultado encontrado. Altere os termos de sua pesquisa e cheque os filtros aplicados." />
          )}
          {store.isError && (
            <EmptyList message="Houve um problema ao carregar os dados. Verifique sua conexão com a internet" />
          )}
          {!listRenderConstraint && (
            <SectionList
              sections={daysForSectionView}
              ref={this.sectionList}
              initialNumToRender={3}
              renderItem={this.renderDay}
              onViewableItemsChanged={this.changeHighlightedDay}
              getItemLayout={this.getItemLayout}
              renderSectionHeader={({section: {data, title}}) =>
                data.length ? (
                  <DaySeparator
                    key={title}
                    day={title}
                    height={store.sectionHeaderHeight}
                  />
                ) : null
              }
              ListHeaderComponent={
                !store.learnedToFavorite && (
                  <View style={styles.tableHeader.wrapper}>
                    <View style={styles.tableHeader.container}>
                      <Text style={styles.tableHeader.text}>
                        {store.listHeaderTexts[this.props.currentPage]}
                      </Text>
                    </View>
                  </View>
                )
              }
              ListFooterComponent={
                <View style={styles.tableHeader.wrapperFooter}>
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
