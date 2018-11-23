import React, { Component } from 'react';
import { Dimensions, StyleSheet } from 'react-native'
import { observer } from 'mobx-react';
import { Item, Input, Picker } from 'native-base'
import { responsiveWidth } from 'react-native-cross-platform-responsive-dimensions'
import * as colors from 'styles/colors.js'
import * as fonts from 'styles/fonts.js'

@observer
export default class DropdownField extends Component {
  render() {
    return (
      <Item style={styles.field} rounded>
        <Picker
          style={styles.picker}
          selectedValue={this.props.selectedValue}
          onValueChange={this.props.handleSelect}
        >
          {this.props.options.map((option, index) => (
            <Picker.Item 
              key={index}
              label={option} 
              value ={option}
            />
          ))}
        </Picker>
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
  picker: {
    width: '100%'
  }
})