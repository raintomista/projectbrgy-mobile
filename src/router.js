import React from 'react';
import {
  createStackNavigator,
  DrawerNavigator
} from 'react-navigation'

import Login from './screens/Login';
import MemberHome from './screens/member/MemberHome';
import MemberSidebar from './screens/member/MemberSidebar';
import ProfileFollowing from './screens/shared/profile/ProfileFollowing';


export const MemberDrawer = DrawerNavigator({
  Home: {
    screen: MemberHome,
    navigationOptions: {
      header: null
    }
  },
  ProfileFollowing: {
    screen: ProfileFollowing,
    navigationOptions: {
      header: null
    }
  },
}, {
  contentComponent: MemberSidebar,
  width: 200,
  initialRouteName: 'ProfileFollowing'
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