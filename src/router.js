import React from 'react';
import { StackNavigator } from 'react-navigation'

import SignIn from './screens/SignIn'

export const Base = StackNavigator({
  SignIn: {
    screen: SignIn,
    navigationOptions: {
      title: 'Welcome to B2P',
      header: null,
    },
  },
});