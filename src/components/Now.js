import React from 'react';
import Events from './Events';
import { Text, View, ScrollView, AppState, Image, StyleSheet } from 'react-native';
import moment from 'moment-timezone';
import { StoreContext } from 'app/Store';
import styles from 'app/styles';
import logo from '../../assets/img/logo_horizontal.svg';

function EventsOrEmpty(props) {
  if (props.scheduleInDate) {
    return <Events { ...props } />
  }

  return (
    <Text>
      {props.emptyMessage}
    </Text>
  )
}

class Now extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      now: [], next: []
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

  setupInterval = (appState) => {
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
      })
    }, 5 * 60 * 1000);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      now: Now.getNow(nextProps.store.fullSchedule),
      next: Now.getNext(nextProps.store.fullSchedule),
    }
  }

  static getNow(days) {
    const today = moment().tz('America/Fortaleza').date();
    const day = days[today];
    if (day) {
      const currentDate = moment().tz('America/Fortaleza').toDate().getTime();
      for (let eventKey = 0; eventKey < day.length; eventKey++) {
        const { date } = day[eventKey];
        let nextDate;
        if (day[eventKey+1]) {
          nextDate = day[eventKey+1].date;
        } else {
          nextDate = { getTime: () => date.getTime() + 30 * 60 * 1000 };
        }
  
        if (currentDate >= date.getTime() && currentDate < nextDate.getTime()) {
          return day[eventKey];
        }
      }
    }
  }

  static getNext(days) {
    const today = moment().tz('America/Sao_Paulo').date();
    const day = days[today];
    if (day) {
      const currentDate = moment().tz('America/Sao_Paulo').toDate().getTime();
      for (let eventKey = 0; eventKey < day.length; eventKey++) {
        if (eventKey+1 < day.length) {
          const { date } = day[eventKey];
          const { date: nextDate } = day[eventKey+1]

          if (currentDate >= date.getTime() && currentDate < nextDate.getTime()) {
            return day[eventKey+1];
          }
        }
      }
    }
  }

  render(){
    const { store: { favorites, actions: { toggleFavorite }} } = this.props;
    return (
      <ScrollView>
        <Image
          source={logo}
          alt="Python Brasil 2018, edição 14 Logo"
        />
        <Text style={styles.dateSeparatorText}>
          Rolando agora
        </Text>
        <EventsOrEmpty emptyMessage="Nada rolando agora :(" scheduleInDate={this.state.now} favorites={favorites} toggleFavorite={toggleFavorite}/>
        <Text className="day-separator tab-link">
          Em seguida
        </Text>
        <EventsOrEmpty emptyMessage="Isso é tudo por hoje. Hora de curtir o happy hour!" scheduleInDate={this.state.next} favorites={favorites} toggleFavorite={toggleFavorite} />
        <View className="intern-page-content event-button-area">
          <View className="sponsor-button snake-button">
            <Text className="pybr-button">
              Monte sua programação
            </Text>
          </View>
        </View>
      </ScrollView>
    );

  }
}

export default (props) => (
  <StoreContext.Consumer>
    {store => <Now { ...props} store={store}/>}
  </StoreContext.Consumer>
);
