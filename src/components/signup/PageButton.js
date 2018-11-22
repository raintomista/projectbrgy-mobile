import React, { Component } from 'react';
import { StyleSheet } from 'react-native'
import { observer } from 'mobx-react';
import { Button, Icon,Text } from 'native-base'
import { responsiveWidth } from 'react-native-cross-platform-responsive-dimensions'
import * as colors from 'styles/colors.js'
import * as fonts from 'styles/fonts.js'

@observer
export default class PageButton extends Component {
  render() {
    return (
      <Button 
        style={[this.props.disabled ? styles.disabledButton : styles.button, { marginLeft: this.props.marginLeft }]} 
        onPress={this.props.handlePress}
        disabled={this.props.disabled}
        rounded 
      >
        <Text 
          uppercase={false}
          style={styles.buttonText}
        >
          {this.props.label}
        </Text>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#cc1457',
    elevation: 0,
    justifyContent: 'center',
    marginBottom: 15,    
    paddingVertical: 25,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0,
    width: '50%'
  },
  buttonText: {
    fontFamily: fonts.MONTSERRAT_BOLD,
    fontSize: 18,
    textAlign: 'center'
  },
  disabledButton: {
    backgroundColor: '#d07697',
    elevation: 0,
    justifyContent: 'center',
    marginBottom: 15,    
    paddingVertical: 25,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0,
    width: '50%'
  }
})