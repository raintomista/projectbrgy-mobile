import React, { Component } from 'react';
import { Dimensions, AsyncStorage, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Header, Icon, Button, Content, Container } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight } from 'react-native-cross-platform-responsive-dimensions'
import InputField from 'components/forgot/InputField';
import SubmitButton from 'components/forgot/SubmitButton';
import { TransparentHeaderWithGoBack } from 'components/common'
import * as colors from 'styles/colors.js'
import * as fonts from 'styles/fonts.js'

import NavigationService from 'services/NavigationService';

export default class Forgot extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <LinearGradient 
        colors={[colors.PRIMARY, colors.SECONDARY]} 
        style={styles.linearGradientView}
      >
        <TransparentHeaderWithGoBack />
        <View style={styles.content}>
          <Text style={styles.title}>
            Forgot Password
          </Text>
          <InputField 
            placeholder="Enter your email address" 
          />
          <SubmitButton label="Send Reset Link"/>
        </View>
      </LinearGradient>        
    );
  }
}

const styles = StyleSheet.create({
  linearGradientView: {
    flexDirection: 'column',
    height: Dimensions.get('window').height
  },
  content: {
    paddingTop: 24,
    paddingHorizontal: 20, 
  },
  title: {
    color: 'white',    
    fontSize: 38,
    fontFamily: fonts.MONTSERRAT_BOLD,
    marginBottom: 30,
    textAlign: 'left'
  }
});