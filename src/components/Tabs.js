import React from 'react';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

function getIcon(navigation, focused, tintColor) {
  const {routeName} = navigation.state;
  const icons = {
    Programação: 'ios-calendar',
    Agora: 'ios-time',
    'Minha lista': 'ios-bookmark',
  };
  return <Ionicons name={icons[routeName]} size={25} color={tintColor} />;
}

function getNavigationBar(routes) {
  return createBottomTabNavigator(routes, {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, tintColor}) =>
        getIcon(navigation, focused, tintColor),
    }),
    tabBarOptions: {
      style: {
        backgroundColor: '#0D273C',
      },
      tabStyle: {
        backgroundColor: '#0D273C',
      },
      activeTintColor: '#7fc7cf',
      inactiveTintColor: 'white',
      activeBackgroundColor: '#0D273C',
      inactiveBackgroundColor: '#0D273C',
    },
  });
}

export default getNavigationBar;
