import React from 'react';
import {
  createStackNavigator,
  createDrawerNavigator
} from 'react-navigation'

import Login from 'screens/Login';
import MemberHome from 'screens/member/MemberHome';
import MemberSidebar from 'screens/member/MemberSidebar';
import MemberReports from 'screens/member/MemberReports';
import MemberCreateReport from 'screens/member/MemberCreateReport';
import MemberRespondedReports from 'screens/member/MemberRespondedReports';
import ProfileFollowing from 'screens/shared/profile/ProfileFollowing';


export const MemberDrawer = createDrawerNavigator({
  Home: { screen: MemberHome },
  MemberFollowing: { screen: ProfileFollowing },
  MyReportStack: createStackNavigator({
    MyReports: { 
      screen: MemberReports,
      navigationOptions: { header: null }
    },
    CreateReport: { 
      screen: MemberCreateReport,
      navigationOptions: { header: null }
    },
  }),
  MyRespondedReportStack: createStackNavigator({
    MyRespondedReports: {
      screen: MemberRespondedReports,
      navigationOptions: { header: null }
    }
  })
}, {
  contentComponent: MemberSidebar,
  width: 200,
  initialRouteName: 'MyReportStack'
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