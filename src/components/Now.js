import React from 'react';
import Events from './events';
import {
  Text,
  View,
  ScrollView,
  AppState,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import moment from 'moment-timezone';
import {StoreContext} from 'app/Store';
import styles from 'app/styles';
import {getFormattedTime} from 'app/utils';
import Logo from '../../assets/img/logo_python_brasil-03.png';

function EventsOrEmpty(props) {
  if (props.scheduleInDate) {
    const events = props.scheduleInDate.events.map(e => ({
      ...e,
      layout: {
        height: 'auto',
      },
    }));

    const scheduleInDate = {
      ...props.scheduleInDate,
      events,
    };

    const [hour, minutes] = getFormattedTime(props.scheduleInDate.date).split(
      'h',
    );
    return (
      <View style={styles.now.eventsWrapper}>
        <View style={styles.now.timeWrapper}>
          <View style={styles.now.line} />
          <View style={styles.now.timeContainer}>
            <Text style={styles.now.timeText}>{hour}</Text>
            <Text style={styles.now.timeText}>{minutes}</Text>
          </View>
          <View style={styles.now.line} />
        </View>
        <View style={styles.now.eventsContainer}>
          <Events {...props} scheduleInDate={scheduleInDate} hideTimeline />
        </View>
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

  openEventDetails = (event, date) => {
    const {navigation} = this.props;
    navigation.navigate('Details', {
      event,
      date,
    });
  };

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
    }, 1000 * 60);
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      now: Now.getNow(nextProps.store.fullSchedule),
      next: Now.getNext(nextProps.store.fullSchedule),
    };
  }

  static getNow(days) {
    //()
    const today = moment()
      .tz('America/Sao_Paulo')
      .date();
    const day = days[today];
    if (day) {
      const currentDate = moment()
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
    const today = moment()
      .tz('America/Sao_Paulo')
      .date();
    const day = days[today];
    if (day) {
      const currentDate = moment()
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
      navigation,
    } = this.props;
    return (
      <SafeAreaView style={styles.schedulePage.container}>
        <ScrollView style={styles.schedulePage.scrollView}>
          <View style={styles.logo.container}>
            <Image source={Logo} style={styles.logo.image} />
          </View>
          <View style={styles.now.dateSeparator}>
            <Text style={styles.dateSeparatorText}>Rolando agora</Text>
            <View style={styles.dateSeparatorLine} />
          </View>
          <EventsOrEmpty
            openEventDetails={this.openEventDetails}
            emptyMessage="Nada rolando agora :("
            scheduleInDate={this.state.now}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
          <View style={styles.now.dateSeparator}>
            <Text style={styles.dateSeparatorText}>Em seguida</Text>
            <View style={styles.dateSeparatorLine} />
          </View>
          <EventsOrEmpty
            openEventDetails={this.openEventDetails}
            emptyMessage="Isso é tudo por hoje. Hora de curtir o happy hour!"
            scheduleInDate={this.state.next}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
          <View style={styles.now.buttonContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Programação')}
              style={styles.now.button}
            >
              <Text style={styles.now.buttonText}>Monte sua programação</Text>
            </TouchableOpacity>
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
