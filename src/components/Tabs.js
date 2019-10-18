import React from 'react';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {darkBlue, yellow, tropicalLight} from 'app/styles';

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
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        height: 55,
        padding: 5,

        backgroundColor: darkBlue,
        borderRadius: 50,
      },
      tabStyle: {
        backgroundColor: darkBlue,
        borderRadius: 50,
      },
      activeTintColor: yellow,
      inactiveTintColor: 'white',
      activeBackgroundColor: darkBlue,
      inactiveBackgroundColor: darkBlue,
    },
  });
}

export default getNavigationBar;
