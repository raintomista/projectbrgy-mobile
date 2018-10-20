import React, { Component } from 'react';
import { StyleSheet } from 'react-native'
import { observer } from 'mobx-react';
import { Button, Form, Text } from 'native-base'
import LinearGradient from 'react-native-linear-gradient';
import LoginInputField from './LoginInputField';
import LoginForm from './LoginForm';
import * as colors from '../../styles/colors.js'
import * as fonts from '../../styles/fonts.js'


@observer
export default class LoginFields extends Component {
  constructor(props) {
    super(props);
    this.form = new LoginForm();
  }

  render() {
    return (
      <Form>
        <LoginInputField 
          placeholder="Email Address" 
          field={this.form.$('email')}
        />
        <LoginInputField 
          placeholder="Password" 
          field={this.form.$('password')} 
          secure
        />
        <Button 
          style={styles.loginButton} 
          onPress={(e) => this.form.onSubmit(e)}
          disabled={this.form.disabled}
          rounded 
          block 
        >
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