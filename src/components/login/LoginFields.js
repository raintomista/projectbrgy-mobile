import React, { Component } from 'react';
import { StyleSheet } from 'react-native'
import { Button, Form, Text } from 'native-base'
import LinearGradient from 'react-native-linear-gradient';
import LoginInputField from './LoginInputField';
import * as colors from '../../styles/colors.js'
import * as fonts from '../../styles/fonts.js'

export default class LoginFields extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Form>
        <LoginInputField placeholder="Email Address"/>
        <LoginInputField placeholder="Password" secure/>
        <Button rounded block style={styles.loginButton}>
          <Text 
            uppercase={false}
            style={styles.loginText}
          >
            Login
          </Text>
        </Button>
      </Form>
    );
  }
}

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: '#cc1457',
    paddingVertical: 25,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0,
    elevation:0
  },
  loginText: {
    fontFamily: fonts.MONTSERRAT_BOLD,
    fontSize: 18,
  }
})