import React from 'react';
import { StackNavigator } from 'react-navigation'

import Login from './screens/Login'

export const Base = StackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      title: 'Welcome to B2P',
      header: null,
    },
  },
});