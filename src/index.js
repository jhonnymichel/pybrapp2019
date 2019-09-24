import { CALENDAR_CONFIG } from './config';
import React from 'react';
import { Text, SafeAreaView, View } from 'react-native';
// import ReactDOM from 'react-dom';
import Store from './Store';
import styles from 'app/styles';
// import { HashRouter as Router, Route, withRouter, Switch, Redirect } from 'react-router-dom';
import Schedule from './components/Schedule';
// import Tabs from './components/Tabs';
// import Now from './components/Now';

const withRouter = () => null;

const TabsWithRouter = withRouter(/* Tabs */);

const ScrollToTop = withRouter(class extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return this.props.children
  }
});

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
      <View style={styles.body}>
        <SafeAreaView>

          <Store data={this.state.data}>
            {store => (
              <Schedule currentPage="schedule" store={store} />
              // <Router>
              //   <ScrollToTop>
              //     <Switch>
              //       <Route exact path="/" render={() => <Now store={store} />} />
              //       <Route exact path="/index.html" render={() => <Now store={store} />} />
              //       <Route exact path="/schedule" render={() => <Schedule key={1} currentPage="schedule" store={store} />} />
              //       <Route exact path="/my-schedule" render={() => {
              //         const days = store.actions.filterDays(store.days, true);
              //         return <Schedule currentPage="my-schedule"  key={2} store={{ ...store, days }} />
              //       }}/>
              //       <Route render={() => <Redirect to="/"/>} />
              //     </Switch>
              //     <TabsWithRouter/>
              //   </ScrollToTop>
              // </Router>
            )}
          </Store>
        </SafeAreaView>
      </View>
    );
  }
}

export default ScheduleManager;
