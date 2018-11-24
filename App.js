import React, { Component } from 'react';
import { AsyncStorage, StatusBar } from 'react-native'; 
import { Root } from 'native-base';
import { AppStack } from './src/router';
import stores from './src/stores/RootStore';
import NavigationService from './src/services/NavigationService';
import * as colors from './src/styles/colors';

import SplashScreen from 'react-native-splash-screen';


export default class App extends Component {
  async componentWillMount() {
    const token = await AsyncStorage.getItem('x-access-token');
    const userRole = await AsyncStorage.getItem('user-role');
    StatusBar.setBackgroundColor(colors.PRIMARY)
    SplashScreen.hide()

    if(token) {
      if(userRole === 'barangay_member') {
        NavigationService.navigate('MemberDrawer', {})
      } else if(userRole === 'barangay_page_admin') {
        NavigationService.navigate('AdminDrawer', {})
      }
    } else {
      NavigationService.navigate('Login', {});
    }
  }

  render() {
    return (
      <Root>
        <AppStack 
          screenProps={{...stores}}
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </Root>
    );
  }
}
