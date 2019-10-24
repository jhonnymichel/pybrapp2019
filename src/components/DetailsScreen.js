import React from 'react';
import {ScrollView, View, SafeAreaView, Text, Image} from 'react-native';
import styles, {white, darkestBlue} from 'app/styles';
import getEventType from 'app/components/events/getEventType';
import Location from 'app/components/events/Location';
import FavoriteButton from 'app/components/events/FavoriteButton';
import Category from 'app/components/events/Category';
import {StoreContext} from 'app/Store';

const EventTypes = event => {
  return {
    ['Lightning']: (
      <View style={styles.eventDetails.wrapper}>
        <Location>{event.location}</Location>
      </View>
    ),
    ['Eventos Fixos']: null,
    ['Palestra']: (
      <>
        <View style={styles.eventDetails.wrapper}>
          <View style={styles.eventDetails.container}>
            <Text style={styles.author}>{event.details.name}</Text>
            <View style={styles.footer.container}>
              <Location>{event.location}</Location>
            </View>
          </View>
        </View>
      </>
    ),
    ['Tutorial']: (
      <>
        <View style={styles.eventDetails.wrapper}>
          <View style={styles.eventDetails.container}>
            <Text style={styles.author}>{event.details.name}</Text>
            <View style={styles.footer.container}>
              <Location prefix={null}>{event.location}</Location>
            </View>
          </View>
        </View>
      </>
    ),
    ['Keynote']: (
      <>
        <View style={styles.eventDetails.wrapper}>
          <View style={styles.footer.container}>
            <Location>{event.location}</Location>
          </View>
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

class DetailsScreen extends React.Component {
  state = {isChanging: false};
  static contextType = StoreContext;
  static navigationOptions = ({navigation}) => ({
    title: 'Detalhes do evento',
    headerTintColor: white,
    headerStyle: {
      backgroundColor: darkestBlue,
    },
  });

  toggleFavorite = () => {
    const {navigation} = this.props;
    const {toggleFavorite} = this.context.actions;
    const event = navigation.getParam('event');
    const date = navigation.getParam('date');
    toggleFavorite(event, date);
  };

  render() {
    const {navigation} = this.props;
    const {favorites} = this.context;
    const event = navigation.getParam('event');
    const isKeynote = event.details.eventType === 'keynote';
    const isFavorite = favorites.includes(event.id);
    return (
      <SafeAreaView style={styles.detailsScreen.wrapper}>
        <ScrollView style={styles.detailsScreen.container}>
          <View style={styles.detailsScreen.categoryContainer}>
            <Category event={event} />
          </View>
          <View style={styles.detailsScreen.titleContainer}>
            <Text style={styles.detailsScreen.title}>
              {isKeynote ? `Keynote: ${event.details.name}` : event.summary}
            </Text>
          </View>
          <View style={styles.detailsScreen.infoContainer}>
            {EventTypes(event)[getEventType(event.details.eventType)]}
          </View>
          <FavoriteButton
            style={styles.detailsScreen.favoriteButton}
            active={isFavorite}
            onPress={this.toggleFavorite}
          />
          <View style={styles.detailsScreen.descriptionContainer}>
            {event.description &&
              event.description.split(/\\n/).map((text, i) => (
                <Text key={i} style={styles.detailsScreen.descriptionTitle}>
                  {text.replace(/\\/, '')}
                </Text>
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default DetailsScreen;
