import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getFormattedTime} from 'app/utils';
import styles, {lightBlue} from 'app/styles';
import Swipeable from 'react-native-gesture-handler/Swipeable';

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

const FavoriteBadge = ({isFavorite}) => {
  return (
    <View style={{marginLeft: 'auto'}}>
      <Ionicons name="ios-bookmark" size={20} color={lightBlue} />
    </View>
  );
};

const EventTypes = (event, date, isFavorite) => {
  return {
    ['Eventos Fixos']: (
      <>
        <Text style={styles.fixedEventTitle}>{event.summary}</Text>
      </>
    ),
    ['Palestra']: (
      <>
        <View style={styles.title.container}>
          <Text style={styles.title.text}>{event.summary}</Text>
        </View>
        <Text style={styles.author}>{event.details.name}</Text>
        <View style={styles.footer.container}>
          <Location>{event.location}</Location>
          <Category event={event} />
          <FavoriteBadge isFavorite={isFavorite} />
        </View>
      </>
    ),
    ['Tutorial']: (
      <>
        <View style={styles.title.container}>
          <Text style={styles.title.text}>{event.summary}</Text>
        </View>
        <Text style={styles.author}>{event.details.name}</Text>
        <View style={styles.footer.container}>
          <Location prefix={null}>{event.location}</Location>
          <FavoriteBadge isFavorite={isFavorite} />
        </View>
      </>
    ),
    ['Keynote']: (
      <>
        <View style={styles.title.container}>
          <Text style={styles.title.text}>{event.details.name}</Text>
        </View>
        <View style={styles.footer.container}>
          <Location>{event.location}</Location>
          <FavoriteBadge isFavorite={isFavorite} />
        </View>
      </>
    ),
    ['Sprints']: (
      <>
        <Text style={styles.title.text}>{event.summary}</Text>
        <Text style={styles.author}>{event.details.description}</Text>
        <Location>{event.location}</Location>
      </>
    ),
  };
};

const swipeStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  listItem: {
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSwipeItem: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
  },
});

const FavoriteButton = ({active, onPress}) => {
  const [scaleAnimation] = React.useState(new Animated.Value(1));

  React.useEffect(() => {
    Animated.timing(scaleAnimation, {
      toValue: active ? 1.5 : 1,
      duration: 300,
      easing: Easing.bezier(0.16, 0.53, 0.06, 1.36),
      useNativeDriver: true,
    }).start();
  }, [active]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        swipeStyles.rightSwipeItem,
        {
          backgroundColor: active ? 'lightgoldenrodyellow' : 'steelblue',
        },
      ]}
    >
      <Animated.View style={{transform: [{scale: scaleAnimation}]}}>
        <Ionicons name="ios-bookmark" size={30} />
      </Animated.View>
    </TouchableOpacity>
  );
};

class Event extends React.Component {
  swipeableRef = React.createRef(null);

  onFavoriteButtonPress = async () => {
    const {event, scheduleInDate, toggleFavorite} = this.props;
    await toggleFavorite(event, scheduleInDate.date);
    setTimeout(() => {
      this.swipeableRef.current.close();
    }, 300);
  };

  renderRightActions = () => {
    const {isFavorite, toggleFavorite} = this.props;
    return (
      <FavoriteButton
        active={isFavorite}
        onPress={this.onFavoriteButtonPress}
      />
    );
  };

  render() {
    const {event, scheduleInDate, isFavorite} = this.props;
    return (
      <Swipeable
        ref={this.swipeableRef}
        key={event.id}
        renderRightActions={this.renderRightActions}
      >
        <View style={{...styles.eventContainer, height: event.layout.height}}>
          {
            EventTypes(event, scheduleInDate.date, isFavorite)[
              getEventType(event.details.eventType)
            ]
          }
        </View>
      </Swipeable>
    );
  }
}

function Events({scheduleInDate, favorites, toggleFavorite}) {
  return (
    <View style={styles.scheduleContainer}>
      <View style={styles.time.container}>
        <Text style={styles.time.text}>
          {getFormattedTime(scheduleInDate.date)}
        </Text>
      </View>
      <View style={styles.timelineIllustration.container}>
        <View style={styles.timelineIllustration.ball} />
        <View style={styles.timelineIllustration.line} />
      </View>
      <View style={styles.dayContainer}>
        {scheduleInDate.events.map(event => (
          <Event
            key={event.id}
            {...{scheduleInDate, toggleFavorite}}
            isFavorite={favorites.includes(event.id)}
            event={event}
          />
        ))}
      </View>
    </View>
  );
}

export default Events;
