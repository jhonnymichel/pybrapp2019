import React from 'react';
import get from 'lodash/get';
import defaultTo from 'lodash/defaultTo';
import every from 'lodash/every';
import mapValues from 'lodash/mapValues';
import moment from 'moment-timezone';
import {Dimensions} from 'react-native';
import Toast from 'react-native-root-toast';

import styles from 'app/styles';
import AsyncStorage from '@react-native-community/async-storage';
import rnTextSize from 'react-native-text-size';
import PushNotification from 'react-native-push-notification';
import upperFirst from 'lodash/upperFirst';

export const StoreContext = React.createContext();
const screenWidth = Math.round(Dimensions.get('window').width);

PushNotification.configure({
  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    console.log('NOTIFICATION:', notification);

    // process the notification
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    sound: true,
  },
  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   */
  requestPermissions: false,
});

class Store extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      days: {},
      isInitialState: true,
      searchFilter: '',
      favorites: [],
      isShowingAdvancedFilters: false,
      sectionHeaderHeight: 0,
      listHeaderHeights: {},
      listHeaderTexts: {},
    };

    this.actions = {
      onCategoryFilterChange: this.onFilterChange.bind(this, 'categoryFilter'),
      onTypeFilterChange: this.onFilterChange.bind(this, 'typeFilter'),
      filterDays: this.filterDays.bind(this),
      filterEvents: this.filterEvents.bind(this),
      getAllFavoriteEvents: this.getAllFavoriteEvents,
      toggleFavorite: this.toggleFavorite,
      onSearchFilterChange: this.onSearchFilterChange.bind(this),
      checkSearchMatch: this.checkSearchMatch.bind(this),
    };
  }

  async componentDidMount() {
    const favorites = await this.getFavorites();
    const learnedToFavorite = await AsyncStorage.getItem('learnedToFavorite');
    const validFavorites = favorites.filter(id =>
      this.props.data.items.find(i => i.id === id),
    );
    await AsyncStorage.setItem('favoriteTalks', JSON.stringify(validFavorites));

    const timeWidth = (await rnTextSize.measure({
      text: '88h88',
      fontFamily: styles.time.text.fontFamily,
      fontSize: styles.time.text.fontSize,
    })).width;
    const calendarData = await this.reduceCalendarData(
      this.props.data,
      timeWidth,
    );
    const sectionHeaderHeight =
      (await rnTextSize.measure({
        text: 'Dia 99 - Tutorais',
        width: screenWidth - styles.dateSeparator.padding * 2,
        fontFamily: styles.dateSeparatorText.fontFamily,
        fontSize: styles.dateSeparatorText.fontSize,
      })).height +
      styles.dateSeparator.padding * 2 +
      styles.dateSeparatorLine.marginTop +
      styles.dateSeparatorLine.height;

    const listHeaderTexts = {
      schedulePage:
        'Arraste um evento para a esquerda para adicioná-lo à sua lista e receber notificações antes da palestra começar.',
      myListPage:
        'Arraste um evento para a esquerda para removê-lo de sua lista e cancelar notificações.',
    };

    const listHeaderMeasurements = {
      width:
        screenWidth -
        styles.tableHeader.wrapper.padding * 2 -
        styles.tableHeader.container.padding * 2,
      fontFamily: styles.tableHeader.text.fontFamily,
      fontSize: styles.tableHeader.text.fontSize,
    };

    const listHeaderHeights = {
      schedulePage:
        (await rnTextSize.measure({
          text: listHeaderTexts.schedulePage,
          ...listHeaderMeasurements,
        })).height +
        styles.tableHeader.wrapper.padding * 2 +
        styles.tableHeader.container.padding * 2,
      myListPage:
        (await rnTextSize.measure({
          text: listHeaderTexts.myListPage,
          ...listHeaderMeasurements,
        })).height +
        styles.tableHeader.wrapper.padding * 2 +
        styles.tableHeader.container.padding * 2,
    };

    this.setState({
      ...this.state,
      ...calendarData,
      favorites,
      learnedToFavorite,
      sectionHeaderHeight,
      listHeaderHeights,
      listHeaderTexts,
      timeWidth,
      isInitialState: false,
    });
  }

  async getFavorites() {
    let favorites;

    try {
      favorites = JSON.parse(await AsyncStorage.getItem('favoriteTalks')) || [];
    } catch (e) {
      favorites = [];
    }

    console.log(favorites);
    return favorites;
  }

  async getId(eventId) {
    let eventNotificationMap;
    try {
      eventNotificationMap =
        JSON.parse(await AsyncStorage.getItem('eventNotificationMap')) || {};
    } catch (e) {
      eventNotificationMap = {};
    }

    if (eventNotificationMap[eventId]) {
      return eventNotificationMap[eventId];
    }

    let notificationIdIncrementor;
    try {
      notificationIdIncrementor =
        JSON.parse(await AsyncStorage.getItem('notificationIdIncrementor')) ||
        1;
    } catch (e) {
      notificationIdIncrementor = 1;
    }
    const id = Number(notificationIdIncrementor) + 1;
    await AsyncStorage.setItem('notificationIdIncrementor', JSON.stringify(id));

    eventNotificationMap[eventId] = id;
    await AsyncStorage.setItem(
      'eventNotificationMap',
      JSON.stringify(eventNotificationMap),
    );

    return id;
  }

  getNotificationContent(event) {
    if (['coffee', 'lunch'].includes(event.details.eventType)) {
      return {
        title: `${upperFirst(event.summary)}`,
        message: 'Começa em 5 minutos.',
      };
    }

    if (['Lightning Talks'].includes(event.details.eventType)) {
      return {
        title: `${upperFirst(event.summary)}`,
        message: `Começam em 5 minutos na ${event.location}.`,
      };
    }

    if (['keynote'].includes(event.details.eventType)) {
      return {
        title: `Keynote: ${upperFirst(event.details.name)}`,
        message: `Começa em 5 minutos na ${event.location}.`,
      };
    }

    if (event.summary === 'Credenciamento') {
      return {
        title: `Credenciamento`,
        message: `Começa em 5 minutos no ${event.location}.`,
      };
    }

    if (event.summary.startsWith('Abertura da Python')) {
      return {
        title: `${upperFirst(event.summary)}`,
        message: `Começa em 5 minutos na ${event.location}.`,
      };
    }

    return {
      title: `${upperFirst(event.details.eventType)}: ${event.summary}`,
      message: `Começa em 5 minutos na ${event.location}`,
    };
  }

  async scheduleNotification(event, date) {
    PushNotification.requestPermissions();
    const tzDate = moment(date).tz('America/Sao_Paulo');
    const id = String(await this.getId(event.id));
    PushNotification.localNotificationSchedule({
      id,
      userInfo: {id},
      ...this.getNotificationContent(event),
      date: tzDate.subtract(5, 'minutes').toDate(),
    });
  }

  async cancelNotification(id) {
    const eventNotificationMap = JSON.parse(
      (await AsyncStorage.getItem('eventNotificationMap')) || '{}',
    );
    const notificationId = eventNotificationMap[id];

    if (notificationId) {
      PushNotification.cancelLocalNotifications({id: String(notificationId)});
    }
  }

  toggleFavorite = async (event, date) => {
    AsyncStorage.setItem('learnedToFavorite', JSON.stringify(true));
    const {id} = event;
    let isAdding = true;
    try {
      const favorites = await this.getFavorites();
      if (!favorites.includes(id)) {
        favorites.push(id);
        await this.scheduleNotification(event, date);
      } else {
        isAdding = false;
        favorites.splice(favorites.indexOf(id), 1);
        this.cancelNotification(id);
      }
      await AsyncStorage.setItem('favoriteTalks', JSON.stringify(favorites));
      this.setState({favorites});
      console.log(favorites);
      const message = isAdding
        ? 'Evento adicionado a sua lista!'
        : 'Evento removido da sua lista.';
      Toast.show(message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: false,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    } catch (e) {
      Toast.show('Não foi possível salvar sua ação. Algo deu errado :(', {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: false,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
  };

  async reduceCalendarData(data, timeWidth) {
    const days = {};
    const eventTypes = [];
    const talksCategories = [];

    if (data.isError) {
      days.isError = true;
    } else {
      for (let event of data.items) {
        const startDateTime = get(event, 'start.dateTime');
        if (!startDateTime) {
          return;
        }
        const dayOfEvent = new Date(startDateTime).getDate();
        if (!days[dayOfEvent]) days[dayOfEvent] = [];

        const pybrEvent = {
          id: event.id,
          date: new Date(startDateTime),
          summary: event.summary,
          location: event.location,
          details: {},
        };

        if (event.extendedProperties) {
          const {
            author: name,
            type: eventType,
            category,
            duration,
            description,
            requirements,
          } = event.extendedProperties.private;

          pybrEvent.details = {
            name,
            title,
            eventType,
          };

          switch (eventType) {
            case 'keynote':
            case 'talk':
              pybrEvent.details.category = category;
              category &&
                !talksCategories.includes(category) &&
                talksCategories.push(category);
              break;
            case 'tutorial':
              pybrEvent.details = {
                ...pybrEvent.details,
                duration,
                requirements,
                description,
              };
              break;
            case undefined:
              pybrEvent.details = {eventType: 'Sprints', description: name};
              break;
          }
          if (eventType && !eventTypes.includes(eventType))
            eventTypes.push(eventType);
        }
        const eventsOnSameTime = days[dayOfEvent].find(
          h => h.date.getTime() == pybrEvent.date.getTime(),
        );
        if (!eventsOnSameTime) {
          days[dayOfEvent].push({
            date: pybrEvent.date,
            events: [pybrEvent],
            layout: {
              listHeaderHeight: 70,
            },
          });
        } else {
          eventsOnSameTime.events.push(pybrEvent);
        }
        const {
          body,
          title,
          authorTitle,
          location,
          eventContainer,
          time: {container: time},
          timelineIllustration: {container, ball},
        } = styles;

        const eventContainerWidth =
          screenWidth -
          eventContainer.paddingLeft -
          eventContainer.paddingRight -
          timeWidth -
          time.paddingLeft -
          container.paddingLeft -
          container.paddingRight -
          ball.width -
          1;

        const measurements = {
          textsToMeasure: [],
          containerPaddings: [],
        };

        measurements.textsToMeasure.push({
          text: pybrEvent.summary,
          width: eventContainerWidth,
          fontFamily: title.text.fontFamily,
          fontSize: title.text.fontSize,
        });

        switch (pybrEvent.details.eventType) {
          case 'coffee':
          case 'lunch':
            measurements.containerPaddings = [
              eventContainer.paddingBottom,
              title.container.paddingBottom,
              10, // badge
            ];
            break;
          case 'Lightning Talks':
            measurements.containerPaddings = [
              eventContainer.paddingBottom,
              19.5, // location height
              title.container.paddingBottom,
              location.container.paddingTop,
            ];
            break;
          case 'keynote':
            measurements.containerPaddings = [
              19.5, // location height
              eventContainer.paddingBottom,
              location.container.paddingTop,
              title.container.paddingBottom,
            ];
            break;
          case 'tutorial':
          case 'talk':
            measurements.containerPaddings = [
              19.5, // location height
              eventContainer.paddingBottom,
              location.container.paddingTop,
              title.container.paddingBottom,
            ];
            measurements.textsToMeasure.push({
              text: pybrEvent.details.name,
              width: eventContainerWidth,
              fontFamily: authorTitle.fontFamily,
              fontSize: authorTitle.fontSize,
            });
            break;
          default:
            measurements.containerPaddings = [
              eventContainer.paddingBottom,
              title.container.paddingBottom,
            ];
            break;
        }
        let textHeights = 0;

        for (let textParams of measurements.textsToMeasure) {
          textHeights += (await rnTextSize.measure(textParams)).height;
        }
        const containerHeight = measurements.containerPaddings.reduce(
          (height, padding) => height + padding,
          0,
        );

        pybrEvent.layout = {
          height: textHeights + containerHeight,
        };
      }
      for (const day in days) {
        days[day].sort(this.sortByDate);
      }
    }

    return {
      days,
      eventTypes,
      talksCategories,
      categoryFilter: [...talksCategories],
      typeFilter: [...eventTypes],
    };
  }

  sortByDate(eventA, eventB) {
    if (eventA.date == eventB.date) {
      return 0;
    }

    return eventA.date > eventB.date ? 1 : -1;
  }

  onFilterChange(filterType, filters) {
    this.setState(state => ({
      ...state,
      [filterType]: filters,
    }));
  }

  onSearchFilterChange(text) {
    this.setState({
      searchFilter: text,
    });
  }

  checkSearchMatch(event) {
    const searchRegex = new RegExp(this.state.searchFilter.toLowerCase(), 'i');
    return (
      defaultTo(get(event, 'details.title'), '').match(searchRegex) ||
      defaultTo(get(event, 'details.name'), '').match(searchRegex) ||
      defaultTo(get(event, 'summary'), '').match(searchRegex)
    );
  }

  filterEvents(acc, {date, events}) {
    const rooms = [
      'topázio',
      'onix',
      'Sala Macaxeira',
      'Sala Jerimum',
    ].reverse();
    const filteredEvents = events.filter(
      event =>
        this.state.typeFilter.includes(event.details.eventType) &&
        (!event.details.category ||
          this.state.categoryFilter.includes(event.details.category)) &&
        (!this.state.searchFilter || this.checkSearchMatch(event)),
    );

    filteredEvents.sort((a, b) => {
      const roomA = rooms.indexOf(a.location);
      const roomB = rooms.indexOf(b.location);

      if (roomA === roomB) {
        return 0;
      }

      return roomA > roomB ? 1 : -1;
    });
    if (filteredEvents.length) return [...acc, {date, events: filteredEvents}];
    return acc;
  }

  filterDays(days) {
    return days.isError
      ? {}
      : mapValues(days, day => day.reduce(this.actions.filterEvents, []));
  }

  getAllFavoriteEvents = () =>
    mapValues(this.state.days, day =>
      day.reduce((acc, {date, events}) => {
        const filteredEvents = events.filter(e =>
          this.state.favorites.includes(e.id),
        );
        if (!filteredEvents.length) {
          return acc;
        }
        return [
          ...acc,
          {
            date,
            events: filteredEvents,
          },
        ];
      }, []),
    );

  render() {
    const {days, favorites} = this.state;
    const filteredDays = this.filterDays(days);
    const isListEmpty =
      !days.isError && every(filteredDays, day => !day.length);

    0;
    return (
      <StoreContext.Provider
        value={{
          ...this.state,
          isError: days.isError,
          isListEmpty,
          favorites,
          fullSchedule: days,
          days: filteredDays,
          actions: this.actions,
        }}
      >
        {this.props.children}
      </StoreContext.Provider>
    );
  }
}

export default Store;
