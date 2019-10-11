import React from 'react';
import get from 'lodash/get';
import defaultTo from 'lodash/defaultTo';
import every from 'lodash/every';
import mapValues from 'lodash/mapValues';
import moment from 'moment-timezone';
import {Dimensions} from 'react-native';
import styles from 'app/styles';
const nunitoWidths = {
  '0': 9.609375,
  '1': 9.609375,
  '2': 9.609375,
  '3': 9.609375,
  '4': 9.609375,
  '5': 9.609375,
  '6': 9.59375,
  '7': 9.609375,
  '8': 9.609375,
  '9': 9.609375,
  A: 11.640625,
  Á: 11.640625,
  À: 11.640625,
  Â: 11.640625,
  Ã: 11.640625,
  a: 8.484375,
  á: 8.484375,
  à: 8.484375,
  ã: 8.484375,
  â: 8.484375,
  B: 10.796875,
  b: 9.3125,
  C: 10.84375,
  c: 7.671875,
  D: 11.828125,
  d: 9.3125,
  E: 9.3125,
  É: 9.3125,
  È: 9.3125,
  Ê: 9.3125,
  e: 8.4375,
  é: 8.4375,
  è: 8.4375,
  ê: 8.4375,
  F: 8.921875,
  f: 5.25,
  G: 11.59375,
  g: 9.390625,
  H: 12.140625,
  h: 9.09375,
  I: 4.109375,
  Í: 4.109375,
  Î: 4.109375,
  Ì: 4.109375,
  i: 3.71875,
  í: 3.71875,
  ì: 3.71875,
  î: 3.71875,
  J: 5.21875,
  j: 3.71875,
  K: 10.0625,
  k: 8,
  L: 8.640625,
  l: 3.71875,
  M: 13.46875,
  m: 13.640625,
  N: 11.828125,
  n: 9.09375,
  O: 12.234375,
  Ó: 12.234375,
  Ò: 12.234375,
  Õ: 12.234375,
  Ô: 12.234375,
  o: 8.890625,
  ó: 8.890625,
  ò: 8.890625,
  õ: 8.890625,
  ô: 8.890625,
  P: 10.328125,
  p: 9.3125,
  Q: 12.234375,
  q: 9.3125,
  R: 10.984375,
  r: 5.65625,
  S: 9.875,
  s: 7.6875,
  T: 9.578125,
  t: 5.453125,
  U: 11.59375,
  Ú: 11.59375,
  Ù: 11.59375,
  Û: 11.59375,
  u: 8.984375,
  ú: 8.984375,
  ù: 8.984375,
  û: 8.984375,
  V: 11.0625,
  v: 8.234375,
  W: 17.625,
  w: 13.484375,
  X: 10.34375,
  x: 8.296875,
  Y: 9.625,
  y: 8.234375,
  Z: 9.453125,
  z: 8.0625,
  '-': 6.8125,
  '+': 9.609375,
  ':': 3.671875,
  '!': 3.671875,
  '(': 3.671875,
  ')': 3.671875,
  '?': 7.09375,
  ',': 3.671875,
  '.': 3.671875,
  '/': 4.53125,
  '\\': 4.53125,
  ' ': 4,
};
const adventProWidths = {
  '0': 8.796875,
  '1': 3.546875,
  '2': 6.390625,
  '3': 6.90625,
  '4': 8,
  '5': 6.90625,
  '6': 7.46875,
  '7': 7.0625,
  '8': 7.484375,
  '9': 7.46875,
  A: 8.4375,
  Á: 8.4375,
  À: 8.4375,
  Â: 8.4375,
  Ã: 8.4375,
  a: 7.328125,
  á: 7.328125,
  à: 7.328125,
  â: 7.328125,
  ã: 7.328125,
  B: 8.75,
  b: 7.71875,
  C: 6.953125,
  c: 6.140625,
  D: 9.21875,
  d: 7.71875,
  E: 7.453125,
  É: 7.453125,
  È: 7.453125,
  Ê: 7.453125,
  e: 6.953125,
  é: 6.953125,
  è: 6.953125,
  ê: 6.953125,
  F: 7.15625,
  f: 4.859375,
  G: 8.59375,
  g: 7.171875,
  H: 9.421875,
  h: 7.890625,
  I: 4.46875,
  Í: 4.46875,
  Ì: 4.46875,
  Î: 4.46875,
  i: 3.84375,
  í: 3.84375,
  ì: 3.84375,
  î: 3.84375,
  J: 3.3125,
  j: 3.296875,
  K: 7.875,
  k: 7.140625,
  L: 7.046875,
  l: 3.6875,
  M: 11.109375,
  m: 11.796875,
  N: 10.40625,
  n: 8,
  O: 8.796875,
  Ó: 8.796875,
  Ò: 8.796875,
  Ô: 8.796875,
  Õ: 8.796875,
  o: 7.78125,
  ó: 7.78125,
  ò: 7.78125,
  õ: 7.78125,
  ô: 7.78125,
  P: 8.765625,
  p: 7.84375,
  Q: 8.796875,
  q: 7.171875,
  R: 9.03125,
  r: 5.5625,
  S: 8.984375,
  s: 6.90625,
  T: 6.4375,
  t: 4.046875,
  U: 9.0625,
  Ú: 9.0625,
  Ù: 9.0625,
  Û: 9.0625,
  u: 7.15625,
  ú: 7.15625,
  ù: 7.15625,
  û: 7.15625,
  V: 9.46875,
  v: 6.9375,
  W: 12.953125,
  w: 11.296875,
  X: 10.375,
  x: 8.140625,
  Y: 8.90625,
  y: 7.8125,
  Z: 8.8125,
  z: 7.6875,
  '-': 6.5625,
  '+': 6.171875,
  ':': 1.9375,
  '!': 3.84375,
  '(': 3.84375,
  ')': 3.84375,
  '?': 6.421875,
  ',': 2.640625,
  '.': 2.046875,
  '/': 7.0625,
  '\\': 7.0625,
  ' ': 4.45374,
};

export const StoreContext = React.createContext();
const screenWidth = Math.round(Dimensions.get('window').width);
const getLinesAmount = (text, widths, fontSize, containerWidth) =>
  text.split(' ').reduce(
    ({lines, currentLineWidth}, word) => {
      const fontSizeRatio = fontSize / 16;
      if (text === 'Experiências lúdicas na comunidade Python') {
        debugger;
      }
      const wordWidth = Array.from(word).reduce(
        (acc, c) => (widths[c] || widths.m) * fontSizeRatio + acc,
        0,
      );
      if (Math.round(currentLineWidth + wordWidth) >= containerWidth) {
        return {
          lines: lines + 1,
          currentLineWidth: wordWidth + widths[' '] * fontSizeRatio,
        };
      }

      return {
        lines,
        currentLineWidth:
          wordWidth + currentLineWidth + widths[' '] * fontSizeRatio,
      };
    },
    {lines: 0, currentLineWidth: 0},
  );

class Store extends React.Component {
  constructor(props) {
    super(props);
    let favorites;

    try {
      favorites = JSON.parse(localStorage.getItem('favoriteTalks')) || [];
    } catch (e) {
      favorites = [];
    }

    this.state = {
      ...this.reduceCalendarData(props.data),
      searchFilter: '',
      favorites,
      isShowingAdvancedFilters: false,
    };

    this.actions = {
      onCategoryFilterChange: this.onFilterChange.bind(this, 'categoryFilter'),
      onTypeFilterChange: this.onFilterChange.bind(this, 'typeFilter'),
      filterDays: this.filterDays.bind(this),
      filterEvents: this.filterEvents.bind(this),
      toggleFavorite: this.toggleFavorite.bind(this),
      onSearchFilterChange: this.onSearchFilterChange.bind(this),
      checkSearchMatch: this.checkSearchMatch.bind(this),
    };
  }

  getId(eventId) {
    try {
      JSON.parse(localStorage.getItem('eventNotificationMap') || '{}');
    } catch (e) {
      localStorage.removeItem('eventNotificationMap');
    }
    const eventNotificationMap =
      JSON.parse(localStorage.getItem('eventNotificationMap') || '{}') || {};
    if (eventNotificationMap[eventId]) {
      return eventNotificationMap[eventId];
    }
    const id =
      Number(localStorage.getItem('notificationIdIncrementor') || 1) + 1;
    localStorage.setItem('notificationIdIncrementor', id);

    eventNotificationMap[eventId] = id;
    localStorage.setItem(
      'eventNotificationMap',
      JSON.stringify(eventNotificationMap),
    );

    return id;
  }

  getNotificationContent(event) {
    if (event.details.eventType === 'Eventos Fixos') {
      return {
        title: `${event.summary}`,
        text: 'Começa em 5 minutos.',
      };
    }

    return {
      title: `${event.details.eventType}: ${event.summary}`,
      text: `Começa em 5 minutos na ${event.location}`,
    };
  }

  scheduleNotification(event, date) {
    // const tzDate = moment(date).tz('America/Fortaleza');
    // cordova.plugins.notification.local.schedule([{
    //   id: this.getId(event.id),
    //   ...this.getNotificationContent(event),
    //   foreground: true,
    //   trigger: { at: tzDate.subtract(5, 'minutes').toDate() }
    // }]);
  }

  cancelNotification(id) {
    // const eventNotificationMap = JSON.parse(localStorage.getItem('eventNotificationMap') || "{}");
    // const notificationId = eventNotificationMap[id];
    // if (notificationId) {
    //   cordova.plugins.notification.local.cancel(notificationId);
    // }
  }

  toggleFavorite(event, date) {
    // const { id } = event;
    // try {
    //   const favorites = JSON.parse(localStorage.getItem('favoriteTalks')) || [];
    //   if (!favorites.includes(id)) {
    //     favorites.push(id);
    //     window.plugins.toast.showShortBottom('Adicionado aos eventos salvos.');
    //     this.scheduleNotification(event, date);
    //   } else {
    //     window.plugins.toast.showShortBottom('Removido dos eventos salvos.');
    //     favorites.splice(favorites.indexOf(id), 1);
    //     this.cancelNotification(id);
    //   }
    //   localStorage.setItem('favoriteTalks', JSON.stringify(favorites));
    //   this.setState({ favorites });
    // } catch(e) {
    //   console.error('Não foi possível salvar favoritos', e.message);
    // }
  }

  reduceCalendarData(data) {
    const days = {};
    const eventTypes = [];
    const talksCategories = [];

    if (data.isError) {
      days.isError = true;
    } else {
      data.items.forEach(event => {
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
          });
        } else {
          eventsOnSameTime.events.push(pybrEvent);
        }
        const {
          body,
          title,
          authorTitle,
          time: {container: time},
          timelineIllustration: {container, ball},
        } = styles;

        const baseHeights = {
          tutorial: 103.7,
          keynote: 84.3,
          talk: 103.7,
          coffee: 49.7,
          lunch: 49.7,
        };
        const officeHeightPerLine = 19.333;
        const titleHeightPerLine = 21.5;

        const eventContainerWidth =
          screenWidth -
          body.padding * 2 -
          time.width -
          container.paddingLeft -
          container.paddingRight -
          ball.width;

        const titleLines = getLinesAmount(
          pybrEvent.summary,
          adventProWidths,
          title.text.fontSize,
          eventContainerWidth,
        ).lines;

        const authorLines = pybrEvent.details.title
          ? getLinesAmount(
              pybrEvent.details.title,
              nunitoWidths,
              authorTitle.fontSize,
              eventContainerWidth,
            ).lines
          : 0;
        const nameLines = pybrEvent.details.name
          ? getLinesAmount(
              pybrEvent.details.name,
              nunitoWidths,
              authorTitle.fontSize,
              eventContainerWidth,
            ).lines
          : 0;

        pybrEvent.layout = {
          height:
            baseHeights[pybrEvent.details.eventType] +
            authorLines * officeHeightPerLine +
            nameLines * officeHeightPerLine +
            titleLines * titleHeightPerLine,
        };
      });
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

  onFilterChange(filterType, filter) {
    const state = this.state;
    if (state[filterType].includes(filter)) {
      this.setState(state => ({
        ...state,
        [filterType]: state[filterType].filter(f => f !== filter),
      }));
    } else {
      this.setState(state => ({
        ...state,
        [filterType]: [...state[filterType], filter],
      }));
    }
  }

  onSearchFilterChange(e) {
    this.setState({
      searchFilter: e.target.value,
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
      'Sala Tapioca',
      'Sala Rapadura',
      'Sala Macaxeira',
      'Sala Jerimum',
    ].reverse();
    const filteredEvents = events.filter(
      event =>
        this.state.typeFilter.includes(event.details.eventType) &&
        (this.onlySaved ? this.state.favorites.includes(event.id) : true) &&
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

  filterDays(days, onlySaved) {
    this.onlySaved = !!onlySaved;
    return days.isError
      ? {}
      : mapValues(days, day => day.reduce(this.actions.filterEvents, []));
  }

  render() {
    const {days, favorites} = this.state;
    const filteredDays = this.filterDays(days);
    const isListEmpty =
      !days.isError && every(filteredDays, day => !day.length);
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
        }}>
        {this.props.children}
      </StoreContext.Provider>
    );
  }
}

export default Store;
