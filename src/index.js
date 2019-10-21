import {CALENDAR_CONFIG} from './config';
import React from 'react';
import {
  Text,
  SafeAreaView,
  View,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import {createAppContainer} from 'react-navigation';
// import ReactDOM from 'react-dom';
import Store, {StoreContext} from './Store';
import styles from 'app/styles';
import Schedule from './components/Schedule';
import Now from './components/Now';
import Tabs from './components/Tabs';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {white, lightBlue} from './styles';
import EmptyList from './components/EmptyList';

import Ionicons from 'react-native-vector-icons/Ionicons';

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

const Loading = ({message}) => {
  const [animation] = React.useState(new Animated.Value(0));
  const spin = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  React.useLayoutEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.bezier(0.17, 0.67, 0.83, 0.67),
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  return (
    <View style={{...styles.emptyList.container, justifyContent: 'center'}}>
      <Animated.View style={{transform: [{rotate: spin}]}}>
        <AntDesign name="loading2" size={100} color={white} />
      </Animated.View>
      <Text style={{...styles.emptyList.text, paddingTop: 20}}>{message}</Text>
    </View>
  );
};

const LoadingView = () => (
  <View style={styles.body}>
    <SafeAreaView style={{flex: 1}}>
      <Loading message="Carregando..." />
    </SafeAreaView>
  </View>
);
// import Loading from 'img/loading.svg';

const ErrorMessage = ({message}) => (
  <View style={styles.errorMessage.container}>
    <Ionicons name="ios-calendar" size={200} color={lightBlue} />
    <Text style={styles.errorMessage.text}>{message}</Text>
  </View>
);

const ErrorLoading = ({retry}) => (
  <View style={styles.body}>
    <ErrorMessage
      dark
      message="Houve um erro ao carregar os dados. verifique sua conexão com a internet."
    />
    <View style={styles.now.buttonContainer}>
      <TouchableOpacity onPress={retry} style={styles.errorMessage.button}>
        <Text style={styles.errorMessage.buttonText}>Tentar de novo</Text>
      </TouchableOpacity>
    </View>
  </View>
);

class ScheduleManager extends React.Component {
  getSchedule() {
    const {apiKey, calendarId} = CALENDAR_CONFIG;
    const url = encodeURI(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&singleEvents=true&maxResults=9999&timeZone=America/Sao_Paulo`,
    );
    return new Promise(resolve => {
      const timeoutId = setTimeout(async () => {
        const cached = await AsyncStorage.getItem('cachedSchedule');
        if (cached) {
          resolve(JSON.parse(cached));
        }
      }, 10000);
      fetch(url)
        .then(r => {
          clearTimeout(timeoutId);
          return r.ok ? r.json() : Promise.reject(r);
        })
        .then(async r => {
          if (!r.items || !r.items.length) {
            throw new Error('Calendar is crazy');
          }
          await AsyncStorage.setItem('cachedSchedule', JSON.stringify(r));
          resolve(r);
        })
        .catch(async r => {
          clearTimeout(timeoutId);
          const cached = await AsyncStorage.getItem('cachedSchedule');
          if (cached) {
            resolve(JSON.parse(cached));
          } else {
            resolve({isError: true});
          }
        });
    });
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.loadData();
  }

  loadData = () => {
    this.getSchedule().then(data => {
      if (data.isError) {
        this.setState({isError: true});
      } else {
        this.setState({data, isError: false});
      }
    });
  };

  render() {
    if (this.state.isError) {
      return <ErrorLoading retry={this.loadData} />;
    }

    if (!this.state.data) {
      return <LoadingView />;
    }

    return (
      <Store data={this.state.data}>
        <StoreContext.Consumer>
          {store =>
            store.isInitialState ? (
              <LoadingView />
            ) : (
              <App
                ref={navigatorRef => {
                  store.actions.setNavigator(navigatorRef);
                }}
              />
            )
          }
        </StoreContext.Consumer>
      </Store>
    );
  }
}

export default ScheduleManager;
