import {CALENDAR_CONFIG} from './config';
import React from 'react';
import {Text, SafeAreaView, View, StyleSheet} from 'react-native';
import {createAppContainer} from 'react-navigation';
// import ReactDOM from 'react-dom';
import Store from './Store';
import styles from 'app/styles';
import Schedule from './components/Schedule';
import Now from './components/Now';
import Tabs from './components/Tabs';
import AsyncStorage from '@react-native-community/async-storage';
// import Now from './components/Now';

const AppNavigator = Tabs({
  Agora: Now,
  Programação: {
    screen: () => <Schedule currentPage="schedulePage" />,
  },
  'Minha lista': {
    screen: () => <Schedule currentPage="myListPage" />,
  },
});

const App = createAppContainer(AppNavigator);

class ScheduleManager extends React.Component {
  getSchedule() {
    const {apiKey, calendarId} = CALENDAR_CONFIG;
    const url = encodeURI(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&singleEvents=true&maxResults=9999&timeZone=America/Sao_Paulo`,
    );

    return new Promise(resolve => {
      fetch(url)
        .then(r => (r.ok ? r.json() : Promise.reject(r)))
        .then(async r => {
          await AsyncStorage.setItem('cachedSchedule', JSON.stringify(r));
          resolve(r);
        })
        .catch(async r => {
          const cached = await AsyncStorage.getItem('cachedSchedule');
          if (cached) {
            resolve(JSON.parse(cached));
          }
        });
    });
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.getSchedule().then(data => {
      this.setState({data});
    });
  }

  render() {
    if (!this.state.data) {
      return (
        <View style={styles.body}>
          <SafeAreaView>
            <Text>Loading...</Text>
          </SafeAreaView>
        </View>
      );
    }

    return (
      <Store data={this.state.data}>
        <App />
      </Store>
    );
  }
}

export default ScheduleManager;
