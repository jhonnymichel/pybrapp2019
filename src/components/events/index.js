import React from 'react';
import {View, Text} from 'react-native';
import {getFormattedTime} from 'app/utils';
import styles from 'app/styles';
import Event from './Event';
class Events extends React.Component {
  shouldComponentUpdate(nextProps) {
    const {favorites, scheduleInDate, isLastItem} = this.props;
    if (
      nextProps.favorites.length !== favorites.length ||
      scheduleInDate.date !== nextProps.scheduleInDate.date ||
      scheduleInDate.events.length !== nextProps.scheduleInDate.events.length ||
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
      openEventDetails,
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
              onPress={openEventDetails}
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
