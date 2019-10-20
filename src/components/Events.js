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
  const [fade] = React.useState(new Animated.Value(0));
  const isFirstRender = React.useRef({value: true});

  React.useLayoutEffect(() => {
    let duration = 200;
    if (isFirstRender.current.value) {
      duration = 0;
      isFirstRender.current.value = false;
    }

    Animated.timing(fade, {
      toValue: Number(isFavorite),
      duration,
      delay: duration,
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

export const EventTypes = (event, date, isFavorite) => {
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
          <Text style={styles.title.text}>Keynote: {event.details.name}</Text>
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

const FavoriteButton = React.memo(({active, onPress, isChanging}) => {
  const [scaleAnimation] = React.useState(new Animated.Value(1));
  const texts = {
    active: 'Remover de sua lista',
    notActive: 'Adicionar a sua lista',
  };

  const [text, setText] = React.useState(
    active ? texts.active : texts.notActive,
  );

  React.useEffect(() => {
    Animated.timing(scaleAnimation, {
      toValue: active ? 1.5 : 1,
      duration: 200,
      easing: Easing.bezier(0.16, 0.53, 0.06, 1.36),
      useNativeDriver: true,
    }).start();
    if (!isChanging) {
      setText(active ? texts.active : texts.notActive);
    }
  }, [active]);

  React.useEffect(() => {
    if (!isChanging) {
      setText(active ? texts.active : texts.notActive);
    }
  }, [isChanging]);

  return (
    <TouchableOpacity
      disabled={isChanging}
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
});

class Event extends React.Component {
  swipeableRef = React.createRef(null);
  state = {active: true, isChanging: false};
  timeoutIds = [];

  shouldComponentUpdate(nextProps, nextState) {
    const {isChanging} = this.state;
    const {isFavorite} = this.props;

    if (isChanging !== nextState.isChanging) {
      return true;
    }

    if (isFavorite !== nextProps.isFavorite) {
      return true;
    }

    return false;
  }

  componentWillUnmount() {
    try {
      this.timeoutIds.forEach(clearTimeout);
    } catch (e) {
      console.error(e);
    }
  }

  onClose = () => {
    const {event, scheduleInDate, toggleFavorite, currentPage} = this.props;
    this.setState({isChanging: false});
    if (currentPage === 'myListPage') {
      toggleFavorite(event, scheduleInDate.date);
    }
  };

  onFavoriteButtonPress = () => {
    this.setState(
      {
        isChanging: true,
      },
      async () => {
        const {event, scheduleInDate, toggleFavorite, currentPage} = this.props;
        if (currentPage !== 'myListPage') {
          await toggleFavorite(event, scheduleInDate.date);
          let timeoutId = setTimeout(() => {
            if (this.swipeableRef.current && this.swipeableRef.current.close) {
              this.swipeableRef.current.close();
            }
            this.timeoutIds.splice(this.timeoutIds.indexOf(timeoutId), 1);
          }, 200);
        } else {
          this.setState({active: false});
          let timeoutId = setTimeout(() => {
            if (this.swipeableRef.current && this.swipeableRef.current.close) {
              this.swipeableRef.current.close();
            }
            this.timeoutIds.splice(this.timeoutIds.indexOf(timeoutId), 1);
          }, 200);
        }
      },
    );
  };

  renderRightActions = () => {
    let {isFavorite, currentPage} = this.props;
    let {active, isChanging} = this.state;
    if (currentPage === 'myListPage') {
      isFavorite = active;
    }
    return (
      <FavoriteButton
        active={isFavorite}
        onPress={this.onFavoriteButtonPress}
        isChanging={isChanging}
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
        onSwipeableClose={this.onClose}
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

class Events extends React.Component {
  shouldComponentUpdate(nextProps) {
    const {favorites, scheduleInDate, isLastItem} = this.props;
    if (
      nextProps.favorites.length !== favorites.length ||
      scheduleInDate.length !== nextProps.scheduleInDate.length ||
      isLastItem !== nextProps.isLastItem
    ) {
      return true;
    }

    return false;
  }

  render() {
    const {
      scheduleInDate,
      favorites,
      toggleFavorite,
      currentPage,
      timeWidth,
      isLastItem,
      hideTimeline,
    } = this.props;

    return (
      <View style={styles.scheduleContainer}>
        {!hideTimeline && (
          <>
            <View style={{...styles.time.container, width: timeWidth}}>
              <Text style={styles.time.text}>
                {getFormattedTime(scheduleInDate.date)}
              </Text>
            </View>
            <View style={styles.timelineIllustration.container}>
              <View style={styles.timelineIllustration.ball} />
              {!isLastItem && <View style={styles.timelineIllustration.line} />}
            </View>
          </>
        )}
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
