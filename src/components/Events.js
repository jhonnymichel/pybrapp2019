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

const Location = ({children}) => (
  <View style={styles.location.container}>
    <Ionicons name="ios-pin" size={17} color={lightBlue} />
    <Text style={styles.location.text}>{children}</Text>
  </View>
);

const Category = ({event}) =>
  event.details.category ? (
    <View
      style={
        styles.categories[
          event.details.category.toLowerCase().replace(/\s/g, '-')
        ] || styles.categories.default
      }
    >
      <Text style={styles.categories.text}>{event.details.category}</Text>
    </View>
  ) : null;

const FavoriteBadge = ({isFavorite}) => {
  const [fade] = React.useState(new Animated.Value(Number(!isFavorite)));
  const isFirstRender = React.useRef({value: true});

  React.useLayoutEffect(() => {
    let duration = 300;
    if (isFirstRender.current.value) {
      duration = 0;
      isFirstRender.current.value = false;
    }
    Animated.timing(fade, {
      toValue: Number(isFavorite),
      duration,
      delay: (duration && 600) || 0,
      useNativeDriver: true,
    }).start();
  }, [isFavorite]);
  return (
    <Animated.View style={{marginLeft: 'auto', opacity: fade}}>
      <Ionicons name="ios-bookmark" size={20} color={lightBlue} />
    </Animated.View>
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
    flex: 0.75,
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

class Event extends React.PureComponent {
  swipeableRef = React.createRef(null);
  state = {active: true};

  onFavoriteButtonPress = async () => {
    const {event, scheduleInDate, toggleFavorite, currentPage} = this.props;
    if (currentPage !== 'myListPage') {
      await toggleFavorite(event, scheduleInDate.date);
      setTimeout(() => {
        this.swipeableRef.current.close();
      }, 300);
    } else {
      this.setState({active: false});
      setTimeout(() => {
        this.swipeableRef.current.close();
        setTimeout(() => {
          toggleFavorite(event, scheduleInDate.date);
        }, 300);
      }, 300);
    }
  };

  renderRightActions = () => {
    let {isFavorite, currentPage} = this.props;
    if (currentPage === 'myListPage') {
      isFavorite = this.state.active;
    }
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
        rightThreshold={50}
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

class Events extends React.PureComponent {
  render() {
    const {
      scheduleInDate,
      favorites,
      toggleFavorite,
      currentPage,
      isLastItem,
    } = this.props;
    return (
      <View style={styles.scheduleContainer}>
        <View style={styles.time.container}>
          <Text style={styles.time.text}>
            {getFormattedTime(scheduleInDate.date)}
          </Text>
        </View>
        <View style={styles.timelineIllustration.container}>
          <View style={styles.timelineIllustration.ball} />
          {!isLastItem && <View style={styles.timelineIllustration.line} />}
        </View>
        <View style={styles.dayContainer}>
          {scheduleInDate.events.map(event => (
            <Event
              key={event.id}
              {...{scheduleInDate, toggleFavorite, currentPage}}
              isFavorite={favorites.includes(event.id)}
              event={event}
            />
          ))}
        </View>
      </View>
    );
  }
}

export default Events;
