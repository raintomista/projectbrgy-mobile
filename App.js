import React, { Component } from 'react';
import { Root } from 'native-base';
import { AppStack } from './src/router';
import stores from './src/stores/RootStore';

export default class App extends Component {
  render() {
    return (
      <Root>
        <AppStack screenProps={{...stores}}/>
      </Root>
    );
  }
}
