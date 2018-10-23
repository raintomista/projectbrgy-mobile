import React from 'react';
import {
  createStackNavigator,
  createDrawerNavigator
} from 'react-navigation'

import Login from 'screens/Login';
import MemberHome from 'screens/member/MemberHome';
import MemberSidebar from 'screens/member/MemberSidebar';
import MemberReports from 'screens/member/MemberReports';
import ProfileFollowing from 'screens/shared/profile/ProfileFollowing';


export const MemberDrawer = createDrawerNavigator({
  Home: { screen: MemberHome },
  MemberFollowing: { screen: ProfileFollowing },
  MemberReports: { screen: MemberReports },
}, {
  contentComponent: MemberSidebar,
  width: 200,
  initialRouteName: 'MemberReports'
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