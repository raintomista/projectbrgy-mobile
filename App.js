import React, { Component } from 'react';
import { Root } from 'native-base';
import { Base } from './src/router';

export default class App extends Component {
  render() {
    return (
      <Root>
        <Base/>
      </Root>
    );
  }
}
