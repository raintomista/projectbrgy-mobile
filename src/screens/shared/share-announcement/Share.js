import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx'; 
import Moment from 'moment';
import { Alert, Keyboard, StyleSheet, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Container, Content, Input, Footer, Text, Button } from 'native-base';
import { HeaderWithGoBack } from 'components/common';
import NavigationService from 'services/NavigationService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';
import * as localized from 'localization/en';

@observer
export default class Share extends Component {
  render() {
    return (
      <Container>
        <HeaderWithGoBack title="Share" />
        <View style={styles.view}>
          <TextInput
            placeholder="Say something about this..."
            multiline={true}
            ref={(input) => this.input = input}
            autoFocus={true} 
            underlineColorAndroid={colors.TRANSPARENT}
            style={styles.textArea}
            placeholderStyle={styles.textArea}
          />
        </View>
        <Footer style={styles.footer}>
          <Text style={styles.charCount}>200</Text>
          <Button style={styles.footerButton}>
            <Text 
              uppercase={false}
              style={styles.footerButtonText}
            >
              Share
            </Text>
          </Button>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 12
  },
  textArea: {
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 18,
  },
  charCount: {
    color: colors.PRIMARY,
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
  footerButtonText: {
    fontFamily: fonts.LATO_BOLD,
    fontSize: 16,
    fontWeight: 'normal',
    paddingLeft: 25,
    paddingRight: 25
  }
});