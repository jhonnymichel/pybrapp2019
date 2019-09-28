import React from 'react';
import { View, TouchableWithoutFeedback, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getFormattedTime } from 'app/utils';
import styles, { lightBlue } from 'app/styles';

const Location = ({ children }) => (
  <View style={styles.location.container}>
    <Ionicons name="ios-pin" size={17} color={lightBlue} />
    <Text style={styles.location.text}>{children}</Text>
  </View>
);

const Category = ({ event }) => event.details.category ? (
  <View style={styles.categories[event.details.category.toLowerCase().replace(/\s/g, '-')]}>
    <Text style={styles.categories.text}>
      {event.details.category}
    </Text>
  </View>
) : null;

const EventTypes = (event, date, favorites=[], toggleFavorite) => {
  const isFavorite = favorites.includes(event.id);
  return {
    ['Eventos Fixos']: (
      <TouchableWithoutFeedback style={styles.eventContainer}>
        <Text style={styles.fixedEventTitle}>{event.summary}</Text>
      </TouchableWithoutFeedback>
    ),
    ['Palestra']: (
      <View style={styles.eventContainer}>
        <View style={styles.title.container}>
          <Text style={styles.title.text}>
            {event.summary}
          </Text>
          <Category event={event}/>
        </View>
        <Text style={styles.author}>
          {event.details.name}
        </Text>
        <Text style={styles.authorTitle}>
          {event.details.title}
        </Text>
        <Location>{event.location}</Location>
      </View>
    ),
    ['Tutorial']: (
      <View style={styles.eventContainer}>
        <Text style={styles.title.text}>
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
        <Location>{event.location}</Location>
      </View>
    ),
    ['Keynote']: (
      <View style={styles.eventContainer}>
        <View style={styles.title.container}>
          <Text style={styles.title.text}>
            {event.summary}
          </Text>
          <Category event={event}/>
        </View>
        <Text style={styles.author}>
          {event.details.name}
        </Text>
        <Text style={styles.authorTitle}>
          {event.details.title}
        </Text>
        <Location>{event.location}</Location>
      </View>
    ),
    ['Sprints']: (
      <View style={styles.eventContainer}>
        <Text style={styles.title.text}>
          {event.summary}
        </Text>
        <Text style={styles.author}>
          {event.details.description}
        </Text>
        <Location>{event.location}</Location>
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
