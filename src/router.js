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
import MemberReportOverview from 'screens/member/MemberReportOverview';
import Profile from 'screens/shared/profile/Profile';
import ProfileInformation from 'screens/shared/profile/ProfileInformation';
import ProfileFollowing from 'screens/shared/profile/ProfileFollowing';
import ProfileFollowingAlt from 'screens/shared/profile/ProfileFollowingAlt';



export const MemberDrawer = createDrawerNavigator({
  Home: { screen: MemberHome },
  MyProfile: createStackNavigator({
    Profile: { 
      screen: Profile,
      navigationOptions: { header: null }
    },
    ProfileFollowing: {
      screen: ProfileFollowingAlt,
      navigationOptions: { header: null }
    },
    ProfileInformation: {
      screen: ProfileInformation,
      navigationOptions: { header: null }
    }
  }, {
    initialRouteName: 'Profile'
  }),
  MyFollowing: { screen: ProfileFollowing },
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
    },
    MyReportOverview: {
      screen: MemberReportOverview,
      navigationOptions: { header: null }
    }
  })
}, {
  contentComponent: MemberSidebar,
  width: 200,
  initialRouteName: 'MyProfile'
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