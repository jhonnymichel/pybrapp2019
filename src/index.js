import { CALENDAR_CONFIG } from './config';
import React from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
// import ReactDOM from 'react-dom';
import Store from './Store';
import styles from 'app/styles';
import Schedule from './components/Schedule';
import Now from './components/Now';
import Tabs from './components/Tabs';
// import Now from './components/Now';

const AppNavigator = Tabs({
  Now: Now,
  Schedule: {
    screen: () => <Schedule currentPage="schedule" />
  }
});

const App = createAppContainer(AppNavigator);

class ScheduleManager extends React.Component{
  getSchedule() {
    const { apiKey, calendarId } = CALENDAR_CONFIG;
    const url =  encodeURI(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}`);

    return new Promise((resolve) => {
      fetch(url).then((r) => r.ok ? r.json() : Promise.reject())
        .then(r => {
          resolve(r);
        })
        .catch(e => {
          resolve({isError: true})
        });
    });
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.getSchedule().then(data => {
      this.setState({ data });
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
      )
    }

    return (
      <Store data={this.state.data}>
        <App />
      </Store>
    );
  }
}

export default ScheduleManager;
