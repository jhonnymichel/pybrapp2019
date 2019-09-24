import React from 'react';
import get from 'lodash/get';
import defaultTo from 'lodash/defaultTo';
import every from 'lodash/every';
import mapValues from 'lodash/mapValues';
import moment from 'moment-timezone';

class Store extends React.Component {
  constructor(props) {
    super(props);
    let favorites;

    try {
      favorites = JSON.parse(localStorage.getItem('favoriteTalks')) || [];
    } catch(e) {
      favorites = [];
    }

    this.state = {
      ...this.reduceCalendarData(props.data),
      searchFilter: '',
      favorites,
      isShowingAdvancedFilters: false
    }

    this.actions = {
      onCategoryFilterChange: this.onFilterChange.bind(this, 'categoryFilter'),
      onTypeFilterChange: this.onFilterChange.bind(this, 'typeFilter'),
      filterDays: this.filterDays.bind(this),
      filterEvents: this.filterEvents.bind(this),
      toggleFavorite: this.toggleFavorite.bind(this),
      onSearchFilterChange: this.onSearchFilterChange.bind(this),
      checkSearchMatch: this.checkSearchMatch.bind(this),
    }
  }

  getId(eventId) {
    try {
      JSON.parse(localStorage.getItem('eventNotificationMap') || "{}");
    } catch(e) {
      localStorage.removeItem('eventNotificationMap');
    }
    const eventNotificationMap = JSON.parse(localStorage.getItem('eventNotificationMap') || "{}") || {};
    if (eventNotificationMap[eventId]) {
      return eventNotificationMap[eventId];
    }
    const id = Number(localStorage.getItem('notificationIdIncrementor') || 1) + 1;
    localStorage.setItem('notificationIdIncrementor', id);

    eventNotificationMap[eventId] = id;
    localStorage.setItem('eventNotificationMap', JSON.stringify(eventNotificationMap));

    return id;
  }

  getNotificationContent(event) {
    if (event.details.eventType === 'Eventos Fixos') {
      return {
        title: `${event.summary}`,
        text: 'Começa em 5 minutos.'
      }
    }

    return {
      title: `${event.details.eventType}: ${event.summary}`,
      text: `Começa em 5 minutos na ${event.location}`
    }
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
    const eventTypes = ['Eventos Fixos', 'Sprints'];
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
          details: {
            eventType: event.summary === 'Sprints' ? event.summary : 'Eventos Fixos'
          }
        }

        if (event.description) {
          const [
            name,
            title,
            eventType,
            ...params
          ] = event.description.split('|').map(i => i.trim());

          pybrEvent.details = {
            name,
            title,
            eventType,
          };

          switch(eventType) {
            case 'Palestra':
              const [ category ] = params;
              pybrEvent.details.category = category;
              !talksCategories.includes(category) && talksCategories.push(category);
              break;
            case 'Tutorial':
              const [ duration, requirements, description ] = params;
              pybrEvent.details = { ...pybrEvent.details, duration, requirements, description }
              break;
            case undefined:
              pybrEvent.details = { eventType: 'Sprints', description: name };
              break;
          }
          if (eventType && !eventTypes.includes(eventType)) eventTypes.push(eventType);
        }
        const eventsOnSameTime = days[dayOfEvent].find(h => h.date.getTime() == pybrEvent.date.getTime());
        if (!eventsOnSameTime) {
          days[dayOfEvent].push({
            date: pybrEvent.date,
            events: [pybrEvent]
          })
        } else {
          eventsOnSameTime.events.push(pybrEvent);
        }
      });
      for (const day in days) {
        days[day].sort(this.sortByDate);
      }
    }
    return {
      days,
      eventTypes,
      talksCategories,
      categoryFilter: [ ...talksCategories ],
      typeFilter: [ ...eventTypes ]
    }
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
      this.setState((state) => ({
        ...state,
        [filterType]: state[filterType].filter(f => f !== filter)
      }))
    } else {
      this.setState((state) => ({
        ...state,
        [filterType]: [ ...state[filterType], filter ]
      }))
    }
  }

  onSearchFilterChange(e) {
    this.setState({
      searchFilter: e.target.value
    })
  }

  checkSearchMatch(event) {
    const searchRegex = new RegExp(this.state.searchFilter.toLowerCase(), 'i');
    return defaultTo(get(event, 'details.title'), '').match(searchRegex)
      || defaultTo(get(event, 'details.name'), '').match(searchRegex)
      || defaultTo(get(event, 'summary'), '').match(searchRegex);
  }

  filterEvents(acc, { date, events }) {
    const rooms = ['Sala Tapioca', 'Sala Rapadura', 'Sala Macaxeira', 'Sala Jerimum']
      .reverse();
    const filteredEvents = events.filter(event => (
      this.state.typeFilter.includes(event.details.eventType)
        && (this.onlySaved ? this.state.favorites.includes(event.id) : true)
        && (!event.details.category || this.state.categoryFilter.includes(event.details.category))
        && (!this.state.searchFilter || this.checkSearchMatch(event))
    ));

    filteredEvents.sort((a, b) => {
      const roomA = rooms.indexOf(a.location);
      const roomB = rooms.indexOf(b.location);

      if (roomA === roomB) {
        return 0;
      }

      return roomA > roomB ? 1 : -1;
    })
    if (filteredEvents.length)
      return [ ...acc, { date, events: filteredEvents } ];
    return acc;
  }

  filterDays(days, onlySaved) {
    this.onlySaved = !!onlySaved;
    return days.isError ? {} : mapValues(days, day => day.reduce(this.actions.filterEvents, []));
  }

  render() {
    const { days, favorites } = this.state;
    const filteredDays = this.filterDays(days);
    const isListEmpty = !days.isError && every(filteredDays, day => !day.length);
    return this.props.children({
      ...this.state,
      isError: days.isError,
      isListEmpty,
      favorites,
      fullSchedule: days,
      days: filteredDays,
      actions: this.actions
    });
  }
}

export default Store;
