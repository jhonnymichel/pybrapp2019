import React from 'react';
import {View, TouchableWithoutFeedback, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getFormattedTime} from 'app/utils';
import styles, {lightBlue} from 'app/styles';

function getEventType(type) {
  const types = {
    'Eventos Fixos': ['lunch', 'coffee'],
    Palestra: ['talk'],
    Tutorial: ['tutorial'],
    Keynote: ['keynote'],
  };

  for (let t of Object.keys(types)) {
    const rawTypes = types[t];
    if (rawTypes.includes(type)) {
      return t;
    }
  }

  return null;
}

const Location = ({children, prefix = 'Sala'}) => (
  <View style={styles.location.container}>
    <Ionicons name="ios-pin" size={17} color={lightBlue} />
    <Text style={styles.location.text}>
      {prefix && `${prefix} `}
      {children}
    </Text>
  </View>
);

const Category = ({event}) =>
  event.details.category ? (
    <View
      style={
        styles.categories[
          event.details.category.toLowerCase().replace(/\s/g, '-')
        ]
      }
    >
      <Text style={styles.categories.text}>{event.details.category}</Text>
    </View>
  ) : null;

const EventTypes = (event, date, favorites = [], toggleFavorite) => {
  const isFavorite = favorites.includes(event.id);
  return {
    ['Eventos Fixos']: (
      <View style={{...styles.eventContainer, height: event.layout.height}}>
        <Text style={styles.fixedEventTitle}>{event.summary}</Text>
      </View>
    ),
    ['Palestra']: (
      <View style={{...styles.eventContainer, height: event.layout.height}}>
        <View style={styles.title.container}>
          <Text style={styles.title.text}>{event.summary}</Text>
        </View>
        <Text style={styles.author}>{event.details.name}</Text>
        <View style={styles.footer.container}>
          <Location>{event.location}</Location>
          <Category event={event} />
        </View>
      </View>
    ),
    ['Tutorial']: (
      <View style={{...styles.eventContainer, height: event.layout.height}}>
        <View style={styles.title.container}>
          <Text style={styles.title.text}>{event.summary}</Text>
        </View>
        <Text style={styles.author}>{event.details.name}</Text>
        <View style={styles.footer.container}>
          <Location prefix={null}>{event.location}</Location>
        </View>
      </View>
    ),
    ['Keynote']: (
      <View style={{...styles.eventContainer, height: event.layout.height}}>
        <View style={styles.title.container}>
          <Text style={styles.title.text}>{event.details.name}</Text>
        </View>
        <View style={styles.footer.container}>
          <Location>{event.location}</Location>
        </View>
      </View>
    ),
    ['Sprints']: (
      <View style={{...styles.eventContainer, height: event.layout.height}}>
        <Text style={styles.title.text}>{event.summary}</Text>
        <Text style={styles.author}>{event.details.description}</Text>
        <Location>{event.location}</Location>
      </View>
    ),
  };
};

const Events = ({scheduleInDate, favorites, toggleFavorite}) => (
  <View style={styles.scheduleContainer}>
    <View style={styles.time.container}>
      <Text style={styles.time.text}>
        {getFormattedTime(scheduleInDate.date)}
      </Text>
    </View>
    <View style={styles.timelineIllustration.container}>
      <View style={styles.timelineIllustration.ball}></View>
      <View style={styles.timelineIllustration.line}></View>
    </View>
    <View style={styles.dayContainer}>
      {scheduleInDate.events.map(event => (
        <View key={event.id}>
          {
            EventTypes(event, scheduleInDate.date, favorites, toggleFavorite)[
              getEventType(event.details.eventType)
            ]
          }
        </View>
      ))}
    </View>
  </View>
);

export default Events;
