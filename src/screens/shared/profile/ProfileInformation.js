import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Container } from 'native-base';
import { HeaderWithGoBack } from 'components/common';
import { ProfileInformationCard, ContactInformationCard } from 'components/profile';
import NavigationService from 'services/NavigationService';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

@observer
export default class ProfileInformation extends Component {
  @observable profileInfo = null;

  @action
  setProfileInfo(profileInfo) {
    this.profileInfo = profileInfo;
  }

  componentWillMount() {
    this.setProfileInfo(NavigationService.getActiveScreenParams());
  }

  render() {
    return (
      <Container>
        <HeaderWithGoBack 
          title="Profile Details" 
          navigation={this.props.navigation} 
        />
        <View style={styles.view}>
          <ProfileInformationCard
            region={this.profileInfo.region}
            province={this.profileInfo.province}
            municipality={this.profileInfo.municipality}
            barangay={this.profileInfo.barangay}
            barangayCaptain={this.profileInfo.barangayCaptain}
            barangayAddress={this.profileInfo.barangayAddress}
          />
          <ContactInformationCard
            email={this.profileInfo.email}
            mobile={this.profileInfo.mobile}
            landline={this.profileInfo.landline}
          />
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: colors.BACKGROUND,
    minHeight: Dimensions.get('window').height - 56,     
  }
});