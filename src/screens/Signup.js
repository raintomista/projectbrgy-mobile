import React, { Component } from 'react';
import { Dimensions, AsyncStorage, View, StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native';
import { Text, Header, Icon, Content, Container } from 'native-base';
import { action, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight } from 'react-native-cross-platform-responsive-dimensions'
import InputField from 'components/signup/InputField';
import PageButton from 'components/signup/PageButton';
import SignupForm from 'components/signup/SignupForm';

import { HeaderWithGoBack } from 'components/common'
import { forgotPassword } from 'services/AuthService';
import NavigationService from 'services/NavigationService';
import * as colors from 'styles/colors.js'
import * as fonts from 'styles/fonts.js'
import * as localized from 'localization/en';


@observer
export default class Signup extends Component {
  @observable page = 1;

  constructor(props) {
    super(props);
    this.form = new SignupForm();
  }

  render() {
    return (
          <View style={{flex: 1}}>
            <HeaderWithGoBack />
            <LinearGradient 
              colors={[colors.PRIMARY, colors.SECONDARY]} 
              style={styles.linearGradientView}
            >
              <View style={{marginTop: -56}}>
                <Text style={styles.title}>
                  Sign Up
                </Text>
                {this.page === 1 && (
                  <React.Fragment>
                    <InputField 
                      placeholder="First Name" 
                      field={this.form.$('first_name')}
                    />
                    <InputField 
                      placeholder="Middle Name (optional)" 
                      field={this.form.$('middle_name')}                      
                    />
                    <InputField 
                      placeholder="Last Name" 
                      field={this.form.$('last_name')}                      
                    />
                    <InputField 
                      placeholder="Email Address" 
                      field={this.form.$('email')}                      
                    />
                  </React.Fragment>
                )}

                {this.page === 2 && (
                  <React.Fragment>
                    <InputField 
                      placeholder="Username" 
                      field={this.form.$('username')}                      
                    />
                    <InputField 
                      placeholder="Password (must be at least 8 characters long)" 
                      field={this.form.$('password')}                      
                    />
                    <InputField 
                      placeholder="Mobile Phone (optional)" 
                      field={this.form.$('mobile_number')}                                            
                    />
                    <InputField 
                      placeholder="Landline (optional)" 
                      field={this.form.$('landline_number')}   
                    />
                  </React.Fragment>
                )}

                {this.page === 3 && (
                  <React.Fragment>
                    {/* <InputField 
                      placeholder="Region" 
                    />
                    <InputField 
                      placeholder="Province" 
                    />
                    <InputField 
                      placeholder="Municipality" 
                    />
                    <InputField 
                      placeholder="Barangay" 
                    /> */}
                  </React.Fragment>
                )}

                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center'}}>
                  <PageButton 
                    label="Back"
                    handlePress={() => this.handlePrev()}
                    disabled={this.page === 1}        
                  />
                  {this.page === 3 
                    ? <PageButton 
                        label="Submit"
                        handlePress={(e) => this.form.onSubmit(e)}    
                        marginLeft={10}        
                      />
                    : <PageButton
                        label="Proceed"
                        handlePress={() => this.handleNext()}
                        marginLeft={10}                                
                      />
                  }
                </View>
              </View>
            </LinearGradient>        
          </View>
    );
  }

  @action
  handlePrev() {
    this.page = this.page > 1 ? this.page - 1 : 3;
  }

  @action
  handleNext() {
    this.page = this.page < 3 ? this.page + 1 : 1;
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