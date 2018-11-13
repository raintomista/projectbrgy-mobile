import React, { Component } from 'react';
import { AsyncStorage, View, StyleSheet } from 'react-native';
import { Button, Text } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight } from 'react-native-cross-platform-responsive-dimensions'
import * as colors from 'styles/colors.js'
import * as fonts from '../styles/fonts.js'
export default class Splash extends Component {
  render() {
    return (
      <View style={styles.viewContainer}>
        <LinearGradient 
          colors={[colors.PRIMARY, colors.SECONDARY]} 
          style={styles.linearGradientView}
        />
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