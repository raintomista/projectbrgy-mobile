import React, { Component } from 'react';
import { Dimensions, AsyncStorage, View, StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native';
import { Text, Header, Icon, Button, Content, Container } from 'native-base';
import { action, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight } from 'react-native-cross-platform-responsive-dimensions'
import InputField from 'components/forgot/InputField';
import SubmitButton from 'components/forgot/SubmitButton';
import { TransparentHeaderWithGoBack } from 'components/common'
import { forgotPassword } from 'services/AuthService';
import NavigationService from 'services/NavigationService';
import * as colors from 'styles/colors.js'
import * as fonts from 'styles/fonts.js'
import * as localized from 'localization/en';


@observer
export default class Forgot extends Component {
  @observable email = '';

  render() {
    return (
          <View style={{flex: 1}}>
            <TransparentHeaderWithGoBack />
            <LinearGradient 
              colors={[colors.PRIMARY, colors.SECONDARY]} 
              style={styles.linearGradientView}
            >
              <View>
                <Text style={styles.title}>
                  Forgot Password
                </Text>
                <InputField 
                  placeholder="Enter your email address" 
                  handleChange={(text) => this.handleChange(text)}
                  value={this.email}
                />
                <SubmitButton 
                  label="Send Reset Link"
                  handlePress={() => this.handleSubmit()}             
                />
              </View>
            </LinearGradient>        
          </View>
    );
  }

  @action
  handleChange(text) {
    this.email = text;
  }

  @action
  async handleSubmit() {
    try {
      const response = await forgotPassword(this.email);    
      ToastAndroid.show(localized.FORGOT_SUCCESS, ToastAndroid.LONG);
      NavigationService.pop();
    } catch(e) {
      ToastAndroid.show(localized.FORGOT_ERROR, ToastAndroid.SHORT);
    }
  }
}

const styles = StyleSheet.create({
  linearGradientView: {
    flex: 1,
    alignItems: 'center',    
    justifyContent: 'center',
    height: responsiveHeight(100),    
    marginTop: -56,
    paddingHorizontal: 20, 
    zIndex: -1
  },
  title: {
    color: 'white',    
    fontSize: 38,
    fontFamily: fonts.MONTSERRAT_BOLD,
    marginBottom: 30,
    textAlign: 'left'
  }
});