import React, { Component } from 'react';
import { StyleSheet } from 'react-native'
import { observer } from 'mobx-react';
import { Item, Input, Label } from 'native-base'
import { responsiveWidth } from 'react-native-cross-platform-responsive-dimensions'
import * as colors from '../../styles/colors.js'
import * as fonts from '../../styles/fonts.js'

@observer
export default class LoginInputField extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Item 
        style={styles.field} 
        rounded
      >
        <Input 
          placeholder={this.props.placeholder}
          secureTextEntry={ this.props.secure }
          style={styles.fieldInput}
          onChange={(e)=> {
            this.props.field.set('value', e.nativeEvent.text)
          }}
        />
      </Item>
    );
  }
}

const styles = StyleSheet.create({
  field: {
    backgroundColor: colors.LIGHT,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: responsiveWidth(90),
  },
  fieldInput: {
    fontFamily: fonts.LATO_REGULAR,
    padding: 0,
    fontSize: 18,
    margin: 0
  }
})