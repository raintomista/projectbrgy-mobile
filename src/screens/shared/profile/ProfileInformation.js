import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { Dimensions, StyleSheet, ScrollView, View } from 'react-native';
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
    const params = NavigationService.getActiveScreenParams()
    this.setProfileInfo(params);
  }

  render() {
    return (
      <Container>
        <HeaderWithGoBack 
          title="Profile Details" 
        />
        <View style={styles.view}>
          <ScrollView>
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
          </ScrollView>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,  
  }
});