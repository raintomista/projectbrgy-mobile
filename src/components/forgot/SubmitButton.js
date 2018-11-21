import React, { Component } from 'react';
import { StyleSheet } from 'react-native'
import { observer } from 'mobx-react';
import { Button, Text } from 'native-base'
import { responsiveWidth } from 'react-native-cross-platform-responsive-dimensions'
import * as colors from 'styles/colors.js'
import * as fonts from 'styles/fonts.js'

@observer
export default class SubmitButton extends Component {
  render() {
    return (
      <Button 
        style={styles.button} 
        onPress={this.props.handlePress}
        disabled={this.props.disabled}
        rounded 
        block 
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
    paddingVertical: 25,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0,
    elevation:0
  },
  buttonText: {
    fontFamily: fonts.MONTSERRAT_BOLD,
    fontSize: 18,
  }
})