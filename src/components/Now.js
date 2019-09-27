import React from 'react';
import Events from './Events';
import moment from 'moment-timezone';
//import logo from 'img/logo_horizontal.svg';

function EventsOrEmpty(props) {
  if (props.scheduleInDate) {
    return <Events { ...props } />
  }

  return (
    <h3 className="empty-message--small">
      {props.emptyMessage}
    </h3>
  )
}

class Now extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      now: [], next: []
    };

    this.setupInterval = this.setupInterval.bind(this);
    this.setupInterval();

    document.addEventListener('pause', () => {
      clearInterval(this.setupInterval);
    });

    document.addEventListener('resume', this.setupInterval);
  }

  setupInterval() {
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

  componentWillUnmount() {
    clearInterval(this.intervalId);
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
    const today = moment().tz('America/Fortaleza').date();
    const day = days[today];
    if (day) {
      const currentDate = moment().tz('America/Fortaleza').toDate().getTime();
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
      <div>
        <div className="app-bar">
          <h2>Python Brasil 14</h2>
        </div>
        <div className="app-bar-compensator" aria-hidden="true">
        </div>
        {/* <img src={logo} width="70%" style={{maxWidth: 300, display: 'block', margin: '10px auto'}} height="auto" alt="Python Brasil 2018, edição 14 Logo"/> */}
        <h3 className="day-separator tab-link">
          Rolando agora
        </h3>
        <EventsOrEmpty emptyMessage="Nada rolando agora :(" scheduleInDate={this.state.now} favorites={favorites} toggleFavorite={toggleFavorite}/>
        <h3 className="day-separator tab-link">
          Em seguida
        </h3>
        <EventsOrEmpty emptyMessage="Isso é tudo por hoje. Hora de curtir o happy hour!" scheduleInDate={this.state.next} favorites={favorites} toggleFavorite={toggleFavorite} />
        <div className="intern-page-content event-button-area">
          <div className="sponsor-button snake-button">
            <Link to="/schedule" className="pybr-button">
              <span>Monte sua</span> programação
            </Link>
          </div>
        </div>
      </div>
    );

  }
}


export default Now;