import React, { Component } from 'react';
import { AsyncStorage, View, StyleSheet } from 'react-native';
import { Button, Text } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight } from 'react-native-cross-platform-responsive-dimensions'
import LoginFields from '../components/login/LoginFields';
import * as colors from '../styles/colors.js'
import * as fonts from '../styles/fonts.js'

import NavigationService from 'services/NavigationService';

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false }
  }

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
      this.setState({ visible: true });
    }
  }

  render() {
    return (
      <View style={styles.viewContainer}>
        {this.state.visible && (
          <LinearGradient 
            colors={[colors.PRIMARY, colors.SECONDARY]} 
            style={styles.linearGradientView}
          >
            <Text style={styles.title}>
              Know what's happening in your barangay.
            </Text>
            <LoginFields />
          </LinearGradient>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
  },
  linearGradientView: {
    height: responsiveHeight(100),
    padding: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: 'white',    
    fontSize: 38,
    fontFamily: fonts.MONTSERRAT_BOLD,
    marginBottom: 30,
    textAlign: 'left'
  },
});