import React from 'react';
import {
  createStackNavigator,
  createSwitchNavigator,
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
import ProfileAlt from 'screens/shared/profile/ProfileAlt';
import ProfileInformation from 'screens/shared/profile/ProfileInformation';
import ProfileFollowing from 'screens/shared/profile/ProfileFollowing';

import MyBarangay from 'screens/shared/barangay-page/MyBarangay';
import BarangayInformation from 'screens/shared/barangay-page/BarangayInformation';
import BarangayFollowing from 'screens/shared/barangay-page/BarangayFollowing';
import BarangayFollowers from 'screens/shared/barangay-page/BarangayFollowers';
import BarangayPage from 'screens/shared/barangay-page/BarangayPage';

import Comments from 'screens/shared/comments/Comments';

import Search from 'screens/shared/search/Search';

const MemberHomeStack = createStackNavigator({
  Home: {
    screen: MemberHome,
    navigationOptions: { header: null }  
  },
  Comments: {
    screen: Comments,
    navigationOptions: { header: null }
  },
  BarangayPage: {
    screen: BarangayPage,
    navigationOptions: { header: null }      
  },
  BarangayInformation: {
    screen: BarangayInformation,
    navigationOptions: { header: null }  
  },
  BarangayFollowing: {
    screen: BarangayFollowing,
    navigationOptions: { header: null }     
  },
  BarangayFollowers: {
    screen: BarangayFollowers,
    navigationOptions: { header: null }     
  },
  Profile: { 
    screen: ProfileAlt,
    navigationOptions: { header: null }
  },
  ProfileFollowing: {
    screen: ProfileFollowing,
    navigationOptions: { header: null }
  },
  ProfileInformation: {
    screen: ProfileInformation,
    navigationOptions: { header: null }
  }
});

const SearchStack = createStackNavigator({
  Search: {
    screen: Search,
    navigationOptions: { header: null }     
  },
  BarangayPage: {
    screen: BarangayPage,
    navigationOptions: { header: null }      
  },
  BarangayInformation: {
    screen: BarangayInformation,
    navigationOptions: { header: null }  
  },
  BarangayFollowing: {
    screen: BarangayFollowing,
    navigationOptions: { header: null }     
  },
  BarangayFollowers: {
    screen: BarangayFollowers,
    navigationOptions: { header: null }     
  },
  Profile: { 
    screen: ProfileAlt,
    navigationOptions: { header: null }
  },
  ProfileFollowing: {
    screen: ProfileFollowing,
    navigationOptions: { header: null }
  },
  ProfileInformation: {
    screen: ProfileInformation,
    navigationOptions: { header: null }
  },
});

const MyBarangayStack = createStackNavigator({
  MyBarangay: {
    screen: MyBarangay,
    navigationOptions: { header: null }      
  },
  BarangayInformation: {
    screen: BarangayInformation,
    navigationOptions: { header: null }  
  },
  BarangayFollowing: {
    screen: BarangayFollowing,
    navigationOptions: { header: null }     
  },
  BarangayFollowers: {
    screen: BarangayFollowers,
    navigationOptions: { header: null }     
  },
  BarangayPage: {
    screen: BarangayPage,
    navigationOptions: { header: null }      
  },
  Profile: { 
    screen: ProfileAlt,
    navigationOptions: { header: null }
  },
  ProfileFollowing: {
    screen: ProfileFollowing,
    navigationOptions: { header: null }
  },
  ProfileInformation: {
    screen: ProfileInformation,
    navigationOptions: { header: null }
  }
});

const ProfileStack = createStackNavigator({
  MyProfile: { 
    screen: Profile,
    navigationOptions: { header: null }
  },
  Profile: { 
    screen: ProfileAlt,
    navigationOptions: { header: null }
  },
  ProfileFollowing: {
    screen: ProfileFollowing,
    navigationOptions: { header: null }
  },
  ProfileInformation: {
    screen: ProfileInformation,
    navigationOptions: { header: null }
  },
  BarangayPage: {
    screen: BarangayPage,
    navigationOptions: { header: null }      
  },
  BarangayInformation: {
    screen: BarangayInformation,
    navigationOptions: { header: null }  
  },
  BarangayFollowing: {
    screen: BarangayFollowing,
    navigationOptions: { header: null }     
  },
  BarangayFollowers: {
    screen: BarangayFollowers,
    navigationOptions: { header: null }     
  }
});

export const MemberDrawer = createDrawerNavigator({
  Home: { screen: MemberHomeStack },
  Search: { screen: SearchStack },
  MyBarangay: { screen: MyBarangayStack },
  MyProfile: { screen: ProfileStack },
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
  initialRouteName: 'Home'
})

export const AppStack = createSwitchNavigator({
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