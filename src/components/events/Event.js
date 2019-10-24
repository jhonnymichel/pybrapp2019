import React from 'react';
import {View, Text, TouchableWithoutFeedback} from 'react-native';
import styles from 'app/styles';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Category from './Category';
import FavoriteBadge from './FavoriteBadge';
import FavoriteButton from './FavoriteButton';
import Location from './Location';
import getEventType from './getEventType';

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
    const {event, scheduleInDate, isFavorite, onPress} = this.props;
    return (
      <Swipeable
        ref={this.swipeableRef}
        rightThreshold={50}
        key={event.id}
        renderRightActions={this.renderRightActions}
        onSwipeableClose={this.onClose}
      >
        <TouchableWithoutFeedback
          onPress={() => onPress(event, scheduleInDate.date)}
        >
          <View style={{...styles.eventContainer, height: event.layout.height}}>
            {
              EventTypes(event, scheduleInDate.date, isFavorite)[
                getEventType(event.details.eventType)
              ]
            }
          </View>
        </TouchableWithoutFeedback>
      </Swipeable>
    );
  }
}

export default Event;
