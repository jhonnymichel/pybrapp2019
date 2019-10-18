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
import styles, {lightBlue, yellow, tropical, white} from 'app/styles';
import Swipeable from 'react-native-gesture-handler/Swipeable';

function getEventType(type) {
  const types = {
    'Eventos Fixos': ['lunch', 'coffee'],
    Palestra: ['talk'],
    Tutorial: ['tutorial'],
    Keynote: ['keynote'],
    Lightning: ['Lightning Talks'],
  };

  for (let t of Object.keys(types)) {
    const rawTypes = types[t];
    if (rawTypes.includes(type)) {
      return t;
    }
  }

  return 'Eventos Fixos';
}

const Location = ({children}) => (
  <View style={styles.location.container}>
    <Ionicons name="ios-pin" size={17} color={lightBlue} />
    <Text style={styles.location.text}>{children}</Text>
  </View>
);

const Category = ({event}) =>
  event.details.category ? (
    <View style={styles.flexOne}>
      <View
        style={
          styles.categories[
            event.details.category.toLowerCase().replace(/\s/g, '-')
          ] || styles.categories.default
        }
      >
        <Text style={styles.categories.text}>{event.details.category}</Text>
      </View>
    </View>
  ) : null;

const FavoriteBadge = ({isFavorite}) => {
  const [fade] = React.useState(new Animated.Value(Number(!isFavorite)));
  const isFirstRender = React.useRef({value: true});

  React.useLayoutEffect(() => {
    let duration = 250;
    if (isFirstRender.current.value) {
      duration = 0;
      isFirstRender.current.value = false;
    }
    Animated.timing(fade, {
      toValue: Number(isFavorite),
      duration,
      delay: (duration && 500) || 0,
      useNativeDriver: true,
    }).start();
  }, [isFavorite]);
  return (
    <Animated.View style={{marginLeft: 'auto', opacity: fade}}>
      <View style={styles.eventDetails.badge}>
        <Ionicons name="ios-bookmark" size={30} color={yellow} />
      </View>
    </Animated.View>
  );
};

const EventTypes = (event, date, isFavorite) => {
  return {
    ['Lightning']: (
      <>
        <View style={styles.eventDetails.wrapper}>
          <View style={styles.eventDetails.container}>
            <View style={styles.title.container}>
              <Text style={styles.fixedEventTitle}>{event.summary}</Text>
            </View>
            <View style={styles.footer.container}>
              <Location>{event.location}</Location>
            </View>
          </View>
          <FavoriteBadge isFavorite={isFavorite} />
        </View>
      </>
    ),
    ['Eventos Fixos']: (
      <>
        <View style={styles.title.container}>
          <View style={styles.eventDetails.wrapper}>
            <View style={styles.eventDetails.container}>
              <Text style={styles.fixedEventTitle}>{event.summary}</Text>
            </View>
            <FavoriteBadge isFavorite={isFavorite} />
          </View>
        </View>
      </>
    ),
    ['Palestra']: (
      <>
        <View style={styles.title.container}>
          <Text style={styles.title.text}>{event.summary}</Text>
        </View>
        <View style={styles.eventDetails.wrapper}>
          <View style={styles.eventDetails.container}>
            <Text style={styles.author}>{event.details.name}</Text>
            <View style={styles.footer.container}>
              <Location>{event.location}</Location>
              <Category event={event} />
            </View>
          </View>
          <FavoriteBadge isFavorite={isFavorite} />
        </View>
      </>
    ),
    ['Tutorial']: (
      <>
        <View style={styles.title.container}>
          <Text style={styles.title.text}>{event.summary}</Text>
        </View>
        <View style={styles.eventDetails.wrapper}>
          <View style={styles.eventDetails.container}>
            <Text style={styles.author}>{event.details.name}</Text>
            <View style={styles.footer.container}>
              <Location prefix={null}>{event.location}</Location>
            </View>
          </View>
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

const FavoriteButton = ({active, onPress}) => {
  const [scaleAnimation] = React.useState(new Animated.Value(1));
  const [text, setText] = React.useState(
    active ? 'Remover de sua lista' : 'Adicionar a sua lista',
  );

  React.useEffect(() => {
    Animated.timing(scaleAnimation, {
      toValue: active ? 1.5 : 1,
      duration: 250,
      easing: Easing.bezier(0.16, 0.53, 0.06, 1.36),
      useNativeDriver: true,
    }).start();
    let timeoutId = setTimeout(() => {
      setText(active ? 'Remover de sua lista' : 'Adicionar a sua lista');
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [active]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.swipe.rightSwipeItem,
        {
          backgroundColor: active ? yellow : tropical,
        },
      ]}
    >
      <Text style={{...styles.swipe.text}}>{text}</Text>
      <Animated.View style={{transform: [{scale: scaleAnimation}]}}>
        <Ionicons name="ios-bookmark" color={white} size={30} />
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
      }, 250);
    } else {
      this.setState({active: false});
      setTimeout(() => {
        this.swipeableRef.current.close();
        setTimeout(() => {
          toggleFavorite(event, scheduleInDate.date);
        }, 250);
      }, 250);
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
      timeWidth,
      isLastItem,
    } = this.props;

    return (
      <View style={styles.scheduleContainer}>
        <View style={{...styles.time.container, width: timeWidth}}>
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
