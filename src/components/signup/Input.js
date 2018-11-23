import React, { Component } from 'react';
import { Dimensions, StyleSheet } from 'react-native'
import { observer } from 'mobx-react';
import { Item, Input } from 'native-base'
import { responsiveWidth } from 'react-native-cross-platform-responsive-dimensions'
import * as colors from 'styles/colors.js'
import * as fonts from 'styles/fonts.js'

@observer
export default class InputField extends Component {
  render() {
    return (
      <Item 
        style={styles.field} 
        rounded
      >
        <Input 
          placeholder={this.props.placeholder}
          placeholderStyle={styles.fieldPlaceholder}
          style={styles.fieldInput}
          onChangeText={(value) => this.props.field.set('value', value)}
          value={this.props.field.value}
        />
      </Item>
    );
  }
}

const styles = StyleSheet.create({
  field: {
    backgroundColor: colors.LIGHT,
    borderColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%'
  },
  fieldInput: {
    fontFamily: fonts.LATO_REGULAR,
    padding: 0,
    fontSize: 18,
    margin: 0
  },
  fieldPlaceholder: {
    fontFamily: fonts.LATO_REGULAR,
  }
})