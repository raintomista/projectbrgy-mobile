import React, { Component } from 'react';
import { Root } from 'native-base';
import { AppStack } from 'router';
import stores from 'stores/RootStore';
import NavigationService from 'services/NavigationService';


export default class App extends Component {
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
