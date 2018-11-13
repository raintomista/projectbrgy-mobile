import React, { Component } from 'react';
import { AsyncStorage } from 'react-native'; 
import { Root } from 'native-base';
import { AppStack } from 'router';
import stores from 'stores/RootStore';
import NavigationService from 'services/NavigationService';


export default class App extends Component {
  async componentWillMount() {
    const token = await AsyncStorage.getItem('x-access-token');
    const userRole = await AsyncStorage.getItem('user-role');

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
