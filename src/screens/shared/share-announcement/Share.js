import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx'; 
import Moment from 'moment';
import { Alert, Keyboard, StyleSheet, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Container, Content, Input, Footer, Text, Button } from 'native-base';
import { HeaderWithGoBack } from 'components/common';
import NavigationService from 'services/NavigationService';
import { sharePost } from 'services/PostService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';
import * as localized from 'localization/en';

@observer
export default class Share extends Component {
  @observable postId = null;
  @observable caption = '';
  @observable disabled = false;

  @action
  toggleDisable() {
    this.disabled = !this.disabled;
  }

  @action
  setPostId(postId) {
    this.postId = postId;
  }

  @action
  handleChangeText(value) {
    this.caption = value;
  }

  @action
  async handleSubmit() {
    this.toggleDisable();
    Keyboard.dismiss()
    try {
      await sharePost(this.postId, this.caption);
      ToastAndroid.show(localized.SHARE_SUCCESS, ToastAndroid.SHORT);    
      this.toggleDisable();
      this.input.focus();
      NavigationService.pop();         
    } catch(e) {        
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);   
      this.toggleDisable();
      this.input.focus();   
    }
  }

  async componentWillMount(){
    await RootStore.sessionStore.getLoggedUser();
    const params = NavigationService.getActiveScreenParams();
    await this.setPostId(params.postId);
  }
  
  render() {
    const charCount = 200 - this.caption.length;
    return (
      <Container>
        <HeaderWithGoBack title="Share" />
        <View style={styles.view}>
          <TextInput
            ref={(input) => this.input = input}
            autoFocus={true} 
            editable={!this.disabled}                
            multiline={true}           
            onChangeText={(value) => this.handleChangeText(value)}
            placeholder="Say something about this..."             
            placeholderStyle={styles.textArea}
            style={styles.textArea}
            underlineColorAndroid={colors.TRANSPARENT} 
            value={this.caption}       
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
              Share
            </Text>
          </Button>
        </Footer>
      </Container>
    );
  }

  checkDisabled(charCount) {
    return this.disabled || charCount === 200 || charCount < 0;
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