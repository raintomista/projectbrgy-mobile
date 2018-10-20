import React from 'react';
import {
  createStackNavigator,
  DrawerNavigator
} from 'react-navigation'

import Login from './screens/Login';
import MemberHome from './screens/member/MemberHome';
import MemberSidebar from './screens/member/MemberSidebar';

export const MemberDrawer = DrawerNavigator({
  Home: {
    screen: MemberHome,
    navigationOptions: {
      title: 'Home',
      header: null
    }
  },
}, {
  contentComponent: MemberSidebar,
  width: 200
})

export const AppStack = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      title: 'Welcome to B2P',
      header: null,
    },
  },
  MemberDrawer: {
    screen: MemberDrawer,
    navigationOptions: {
      header: null,
    }
  }
}, {
  initialRouteName: 'MemberDrawer'
});