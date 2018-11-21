import React, { Component } from 'react';
import { AsyncStorage, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Text } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight } from 'react-native-cross-platform-responsive-dimensions'
import LoginFields from '../components/login/LoginFields';
import NavigationService from 'services/NavigationService';
import * as colors from '../styles/colors.js'
import * as fonts from '../styles/fonts.js'

export default class SignIn extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.viewContainer}>
        <LinearGradient 
          colors={[colors.PRIMARY, colors.SECONDARY]} 
          style={styles.linearGradientView}
        >
          <Text style={styles.title}>
            Know what's happening in your barangay.
          </Text>
          <LoginFields />
          <View style={{flexDirection: 'row', marginTop: 15, alignSelf: 'center' }}>
            <TouchableOpacity onPress={() => NavigationService.push('Signup', {})}>
              <Text style={[styles.linkText]}>Create Account</Text>
            </TouchableOpacity>
            <Text style={styles.linkText}>&nbsp;&nbsp;&middot;&nbsp;&nbsp;</Text>
            <TouchableOpacity onPress={() => NavigationService.push('Forgot', {})}>
              <Text style={styles.linkText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
  },
  linearGradientView: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    color: 'white',    
    fontSize: 38,
    fontFamily: fonts.MONTSERRAT_BOLD,
    marginBottom: 30,
    textAlign: 'left'
  },
  linkText: {
    color: '#859ad8',  
    fontFamily: fonts.LATO_REGULAR,
    fontWeight: 'normal',
    marginBottom: 10,
    textAlign: 'center'
  }
});