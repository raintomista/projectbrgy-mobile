import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx'; 
import { StackActions, NavigationActions } from 'react-navigation';
import Moment from 'moment';
import { Alert, Keyboard, StyleSheet, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Container, Content, Input, Footer, Text, Button } from 'native-base';
import { HeaderWithGoBack } from 'components/common';
import NavigationService from 'services/NavigationService';
import { createPost } from 'services/PostService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';
import * as localized from 'localization/en';

@observer
export default class CreateAnnouncement extends Component {
  @observable reportId = null;
  @observable message = '';
  @observable files = [];
  @observable disabled = false;

  @action
  toggleDisable() {
    this.disabled = !this.disabled;
  }

  @action
  setReportId(reportId) {
    this.reportId = reportId;
  }

  @action
  handleChangeText(value) {
    this.message = value;
  }

  @action
  async handleSubmit() {
    const formData = this.createFormData(this.message, this.files);
    this.toggleDisable();
    Keyboard.dismiss()
    try {
      createPost(formData);
      ToastAndroid.show(localized.POST_SUCCESS, ToastAndroid.SHORT);    
      this.toggleDisable();
      this.input.focus();
      NavigationService.dispatch(StackActions.popToTop());
      NavigationService.dispatch(StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Home' })],
      }));       
    } catch(e) {        
      console.log(e)
      console.log(e.response)
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);   
      this.toggleDisable();
      this.input.focus();   
    }
  }

  createFormData(message, files) {
    let formData = new FormData();
    formData.append('message', message);
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
    }

    return formData;
  }

  async componentWillMount(){
    await RootStore.sessionStore.getLoggedUser();
    const params = NavigationService.getActiveScreenParams();
    await this.setReportId(params.reportId);
  }
  
  render() {
    const charCount = 150 - this.message.length;
    return (
      <Container>
        <HeaderWithGoBack title="Post Announcement" />
        <View style={styles.view}>
          <TextInput
            ref={(input) => this.input = input}
            autoFocus={true} 
            editable={!this.disabled}                
            multiline={true}           
            onChangeText={(value) => this.handleChangeText(value)}
            placeholder="Post an announcement..."             
            placeholderStyle={styles.textArea}
            style={styles.textArea}
            underlineColorAndroid={colors.TRANSPARENT} 
            value={this.message}       
          />
        </View>
        <Footer style={styles.footer}>
          <Text style={charCount < 0 ? styles.invalidCharCount : styles.charCount}>
            {charCount}
          </Text>
          <Button 
            transparent
            onPress={() => this.handleSubmit()}
            style={this.checkDisabled(charCount) ? styles.disabledFooterButton : styles.footerButton}
            disabled={this.checkDisabled(charCount)}
          >
            <Text 
              uppercase={false}
              style={this.checkDisabled(charCount) ? styles.disabledFooterButtonText : styles.footerButtonText}
            >
              Post
            </Text>
          </Button>
        </Footer>
      </Container>
    );
  }

  checkDisabled(charCount) {
    return this.disabled || charCount === 150 || charCount < 0;
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  textArea: {
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 18,
    padding: 12    
  },
  charCount: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_BOLD,
    fontSize: 16,
    marginRight: 10
  },
  invalidCharCount: {
    color: 'red',
    fontFamily: fonts.LATO_BOLD,
    fontSize: 16,
    marginRight: 10
  },
  footer: {
    backgroundColor: colors.LIGHT,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  footerButton: {
    alignSelf: 'center',
    backgroundColor: colors.PRIMARY,
    borderRadius: 25,
    elevation: 0,
    height: null,
    paddingTop: 8,
    paddingBottom: 8,
  },
  disabledFooterButton: {
    alignSelf: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    elevation: 0,
    height: null,
    paddingTop: 8,
    paddingBottom: 8,
  },
  footerButtonText: {
    color: colors.LIGHT,
    fontFamily: fonts.LATO_BOLD,
    fontSize: 16,
    fontWeight: 'normal',
    paddingLeft: 25,
    paddingRight: 25
  },
  disabledFooterButtonText: {
    color: '#a0a0a0',
    fontFamily: fonts.LATO_BOLD,
    fontSize: 16,
    fontWeight: 'normal',
    paddingLeft: 25,
    paddingRight: 25
  }
});