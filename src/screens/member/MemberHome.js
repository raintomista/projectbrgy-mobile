import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Content } from 'native-base';
import { responsiveHeight } from 'react-native-cross-platform-responsive-dimensions'
import HeaderWithDrawer from '../../components/common/HeaderWithDrawer';
import * as colors from '../../styles/colors.js'
import * as fonts from '../../styles/fonts.js'

export default class MemberHome extends Component {
  render() {
    return (
      <Container>
        <HeaderWithDrawer title="Home" navigation={this.props.navigation}/>
        <Content padder>

        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({

});