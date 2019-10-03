import React from 'react';
import Events from './Events';
import {Text, View, ScrollView, AppState, SafeAreaView} from 'react-native';
import moment from 'moment-timezone';
import {StoreContext} from 'app/Store';
import styles from 'app/styles';

function EventsOrEmpty(props) {
  if (props.scheduleInDate) {
    return (
      <View style={{padding: 10}}>
        <Events {...props} />
      </View>
    );
  }

  return (
    <View style={styles.emptyMessage.container}>
      <Text style={styles.emptyMessage.text}>{props.emptyMessage}</Text>
    </View>
  );
}

class Now extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      now: [],
      next: [],
    };
  }

  componentDidMount() {
    this.setupInterval('active');
    AppState.addEventListener('change', this.setupInterval);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.setupInterval);
    this.setupInterval('inactive');
  }

  setupInterval = appState => {
    if (appState.match(/inactive|background/)) {
      clearInterval(this.intervalId);
      return;
    }

    this.setState({
      now: Now.getNow(this.props.store.fullSchedule),
      next: Now.getNext(this.props.store.fullSchedule),
    });

    this.intervalId = window.setInterval(() => {
      this.setState({
        now: Now.getNow(this.props.store.fullSchedule),
        next: Now.getNext(this.props.store.fullSchedule),
      });
    }, 5 * 60 * 1000);
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      now: Now.getNow(nextProps.store.fullSchedule),
      next: Now.getNext(nextProps.store.fullSchedule),
    };
  }

  static getNow(days) {
    //('2018-10-20T14:20')
    const today = moment('2018-10-20T14:20')
      .tz('America/Sao_Paulo')
      .date();
    const day = days[today];
    if (day) {
      const currentDate = moment('2018-10-20T14:20')
        .tz('America/Sao_Paulo')
        .toDate()
        .getTime();
      for (let eventKey = 0; eventKey < day.length; eventKey++) {
        const {date} = day[eventKey];
        let nextDate;
        if (day[eventKey + 1]) {
          nextDate = day[eventKey + 1].date;
        } else {
          nextDate = {getTime: () => date.getTime() + 30 * 60 * 1000};
        }

        if (currentDate >= date.getTime() && currentDate < nextDate.getTime()) {
          return day[eventKey];
        }
      }
    }
  }

  static getNext(days) {
    const today = moment('2018-10-20T14:20')
      .tz('America/Sao_Paulo')
      .date();
    const day = days[today];
    if (day) {
      const currentDate = moment('2018-10-20T14:20')
        .tz('America/Sao_Paulo')
        .toDate()
        .getTime();
      for (let eventKey = 0; eventKey < day.length; eventKey++) {
        if (eventKey + 1 < day.length) {
          const {date} = day[eventKey];
          const {date: nextDate} = day[eventKey + 1];

          if (
            currentDate >= date.getTime() &&
            currentDate < nextDate.getTime()
          ) {
            return day[eventKey + 1];
          }
        }
      }
    }
  }

  render() {
    const {
      store: {
        favorites,
        actions: {toggleFavorite},
      },
    } = this.props;
    return (
      <SafeAreaView style={styles.body}>
        <ScrollView style={styles.schedulePage.scrollView}>
          <Text style={styles.dateSeparatorText}>Rolando agora</Text>
          <EventsOrEmpty
            emptyMessage="Nada rolando agora :("
            scheduleInDate={this.state.now}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
          <Text style={styles.dateSeparatorText}>Em seguida</Text>
          <EventsOrEmpty
            emptyMessage="Isso é tudo por hoje. Hora de curtir o happy hour!"
            scheduleInDate={this.state.next}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
          <View className="intern-page-content event-button-area">
            <View className="sponsor-button snake-button">
              <Text className="pybr-button">Monte sua programação</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default props => (
  <StoreContext.Consumer>
    {store => <Now {...props} store={store} />}
  </StoreContext.Consumer>
);
