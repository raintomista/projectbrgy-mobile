import React from 'react';
import { AsyncStorage } from 'react-native';

import {
  createStackNavigator,
  createSwitchNavigator,
  createDrawerNavigator
} from 'react-navigation'

import Login from 'screens/Login';
import Splash from 'screens/Splash';

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
import Share from 'screens/shared/share-announcement/Share';

import MyBarangay from 'screens/shared/barangay-page/MyBarangay';
import BarangayInformation from 'screens/shared/barangay-page/BarangayInformation';
import BarangayFollowing from 'screens/shared/barangay-page/BarangayFollowing';
import BarangayFollowers from 'screens/shared/barangay-page/BarangayFollowers';
import BarangayPage from 'screens/shared/barangay-page/BarangayPage';

import Comments from 'screens/shared/comments/Comments';

import Search from 'screens/shared/search/Search';

import Inbox from 'screens/shared/messages/Inbox';
import Conversation from 'screens/shared/messages/Conversation';



import BarangayResidents from 'screens/admin/BarangayResidents';
import BarangayKatarungan from 'screens/admin/BarangayKatarungan';
import KatarunganOverview from 'screens/admin/KatarunganOverview';

import BarangayPermits from 'screens/admin/BarangayPermits';
import PermitOverview from 'screens/admin/PermitOverview';

import BarangayClearances from 'screens/admin/BarangayClearances';
import ClearanceOverview from 'screens/admin/ClearanceOverview';

import BarangayReports from 'screens/admin/BarangayReports';
import BarangayReportOverview from 'screens/admin/BarangayReportOverview';
import AddResponse from 'screens/admin/AddResponse';
import BarangayHome from 'screens/admin/BarangayHome';
import CreateAnnouncement from 'screens/admin/CreateAnnouncement';
import AdminSidebar from 'screens/admin/AdminSidebar';







const MemberHomeStack = createStackNavigator({
  Home: {
    screen: MemberHome,
    navigationOptions: { header: null }  
  },
  Share: {
    screen: Share,
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
  },
  Share: {
    screen: Share,
    navigationOptions: { header: null }  
  },
  Comments: {
    screen: Comments,
    navigationOptions: { header: null }
  },
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


const InboxStack = createStackNavigator({
  Inbox: { 
    screen: Inbox,
    navigationOptions: { header: null }
  },
  Conversation: { 
    screen: Conversation,
    navigationOptions: { header: null }
  }
});

export const MemberDrawer = createDrawerNavigator({
  Home: { screen: MemberHomeStack },
  Search: { screen: SearchStack },
  MyBarangay: { screen: MyBarangayStack },
  Messages: { screen: InboxStack },  
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
  initialRouteName: 'Messages'
})



// Admin Routes

const BarangayHomeStack = createStackNavigator({
  Home: {
    screen: BarangayHome,
    navigationOptions: { header: null }  
  },
  CreateAnnouncement: {
    screen: CreateAnnouncement,
    navigationOptions: { header: null }  
  },
  Share: {
    screen: Share,
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

const BarangayReportStack = createStackNavigator({
  Reports: {
    screen: BarangayReports,
    navigationOptions: { header: null }
  },
  ReportOverview: {
    screen: BarangayReportOverview,
    navigationOptions: { header: null }
  },
  AddResponse: {
    screen: AddResponse,
    navigationOptions: { header: null }
  }
});

const ClearanceStack = createStackNavigator({
  ClearanceRequests: {
    screen: BarangayClearances,
    navigationOptions: { header: null }
  },
  ClearanceOverview: {
    screen: ClearanceOverview,
    navigationOptions: { header: null }
  }
});

const PermitStack = createStackNavigator({
  PermitRequests: {
    screen: BarangayPermits,
    navigationOptions: { header: null }
  },
  PermitOverview: {
    screen: PermitOverview,
    navigationOptions: { header: null }
  }
});

const KatarunganStack = createStackNavigator({
  Complaints: { 
    screen: BarangayKatarungan,
    navigationOptions: { header: null }
  },
  ComplaintOverview: {
    screen: KatarunganOverview,
    navigationOptions: { header: null }
  }
});

export const AdminDrawer = createDrawerNavigator({  
  MyBarangay: { screen: MyBarangayStack },
  Search: { screen: SearchStack },
  BarangayHome: { screen: BarangayHomeStack },   
  MyResidents: { screen: BarangayResidents },
  BarangayReports: { screen:  BarangayReportStack },  
  BarangayClearance: { screen:  ClearanceStack },   
  BusinessPermit: { screen:  PermitStack },  
  KatarunganPambarangay: { screen:  KatarunganStack },
},  {
  contentComponent: AdminSidebar,
  width: 200,
  initialRouteName: 'BarangayHome'
});

export const AppStack = createSwitchNavigator({
  Splash: {
    screen: Splash,
    navigationOptions: {
      header: null
    }
  },
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
  },
  AdminDrawer: {
    screen: AdminDrawer,
    navigationOptions: {
      header: null,
    }
  }
}, {
  initialRouteName: 'Splash'
});

