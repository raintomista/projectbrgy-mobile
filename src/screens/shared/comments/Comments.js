import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx';
import { ScrollView, StyleSheet, ToastAndroid, View } from 'react-native';
import { Container, Spinner } from 'native-base';
import { HeaderWithGoBack } from 'components/common';
import { Comment } from 'components/comments';
import { ProfileCard } from 'components/profile';
import NavigationService from 'services/NavigationService';
import { getUserById } from 'services/ProfileService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as localized from 'localization/en';

@observer
export default class Comments extends Component {
  render() {
    return (
      <Container>
        <HeaderWithGoBack 
          title="Comments" 
          navigation={this.props.navigation} 
        />
        <View>
          <Comment message="dadadada" />
          <Comment message="Lorem ipsum dahdha dha fafaf dadada dadha hda dadaj ijdaijdiaj djaijdiaj  dada gfagag agag dajidjai jdajidja" />            
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: colors.BACKGROUND
  }
});