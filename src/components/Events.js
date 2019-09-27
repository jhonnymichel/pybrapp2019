import React from 'react';
import { View, TouchableWithoutFeedback, Text } from 'react-native';
import classNames from 'classnames';
import { getFormattedTime } from 'app/utils';
import styles from 'app/styles';

const EventTypes = (event, date, favorites=[], toggleFavorite) => {
  const isFavorite = favorites.includes(event.id);
  const classes = classNames({
    'favorite': isFavorite
  })
  return {
    ['Eventos Fixos']: (
      <TouchableWithoutFeedback style={styles.eventContainer}>
        <Text style={styles.fixedEventTitle}>{event.summary}</Text>
      </TouchableWithoutFeedback>
    ),
    ['Palestra']: (
      <View style={styles.eventContainer}>
        <Text style={styles.title}>
          {event.summary}
          {event.details.category &&
            <Text style={styles.categories[event.details.category.toLowerCase().replace(/\s/g, '-')]}>
              {event.details.category}
            </Text>
          }
        </Text>
        <Text style={styles.author}>
          {event.details.name}
        </Text>
        <Text style={styles.authorTitle}>
          {event.details.title}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.text}>location_on</Text>{event.location}
        </Text>
      </View>
    ),
    ['Tutorial']: (
      <View style={styles.eventContainer}>
        <Text style={styles.title}>
          {event.summary}
        </Text>
        <Text style={styles.author}>
          Duração: {event.details.duration}
        </Text>
        <Text style={styles.author}>
          {event.details.name}
        </Text>
        <Text style={styles.authorTitle}>
          {event.details.title}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.text}>location_on</Text>{event.location}
        </Text>
      </View>
    ),
    ['Keynote']: (
      <View style={styles.eventContainer}>
        <Text style={styles.text}>
          {event.summary}
          {event.details.category &&
            <Text style={styles.categories[event.details.category.toLowerCase().replace(/\s/g, '-')]}>
              {event.details.category}
            </Text>
          }
        </Text>
        <Text style={styles.text}>
          {event.details.name}
        </Text>
        <Text style={styles.text}>
          {event.details.title}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.text}>location_on</Text>{event.location}
        </Text>
      </View>
    ),
    ['Sprints']: (
      <View style={styles.eventContainer}>
        <Text style={styles.title}>
          {event.summary}
        </Text>
        <Text style={styles.author}>
          {event.details.description}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.text}>location_on</Text>{event.location}
        </Text>
      </View>
    )
  }
};

const Events = ({ scheduleInDate, favorites, toggleFavorite }) => (
  <View style={styles.scheduleContainer}>
    <View style={styles.time.container}>
      <Text style={styles.time.text}>{getFormattedTime(scheduleInDate.date)}</Text>
    </View>
    <View style={styles.timelineIllustration.container}>
      <View style={styles.timelineIllustration.ball}></View>
      <View style={styles.timelineIllustration.line}></View>
    </View>
    <View style={styles.dayContainer}>
    {scheduleInDate.events.map(event => (
      <View key={event.id}>
        {EventTypes(event, scheduleInDate.date, favorites, toggleFavorite)[event.details.eventType]}
      </View>
    ))}
    </View>
  </View>
);

export default Events;
