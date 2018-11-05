import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx';
import { ScrollView, StyleSheet, ToastAndroid, View } from 'react-native';
import { Container, Spinner } from 'native-base';
import { HeaderWithDrawer } from 'components/common';
import { ProfileCard } from 'components/profile';
import NavigationService from 'services/NavigationService';
import { getUserById } from 'services/ProfileService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as localized from 'localization/en';

@observer
export default class Profile extends Component {
  @observable profileId = null;
  @observable profileData = null;

  @action
  setProfileId(profileId) {
    this.profileId = profileId;
  }

  @action
  async getProfileData() {
    try {
      const response = await getUserById(this.profileId);
      runInAction(() => this.profileData = response.data.data);
    } catch(e) {
      console.log(e.response)
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  async componentWillMount(){
    const { sessionStore, profileStore } = RootStore;
    const params = NavigationService.getStackScreenParams();
    this.setProfileId(params.profileId);
    this.getProfileData();
  }

  render() {
    return (
      <Container>
        <HeaderWithDrawer 
          title="Profile" 
          navigation={this.props.navigation} 
        />
        {!this.profileData && <Spinner color={colors.PRIMARY} />}

        {this.profileData && (
          <View style={styles.view}>
            <ScrollView>
              <ProfileCard
                id={this.profileData.id}
                name={`${this.profileData.user_first_name} ${this.profileData.user_last_name}`}
                municipality={this.profileData.barangay_page_municipality}
                followingCount={this.profileData.stats.following_count}
                handleFollow={() => this.followPage()}
                handleUnfollow={() => this.unfollowPage()}
                region={this.profileData.barangay_page_region}
                province={this.profileData.barangay_page_province}
                barangay={this.profileData.barangay_page_name}
                barangayCaptain={this.profileData.barangay_page_captain}
                barangayAddress={this.profileData.barangay_page_office_address_street}
                email={this.profileData.user_email}
                landline={this.profileData.user_landline_number}
                mobile={this.profileData.user_mobile_number}
              />
            </ScrollView>
          </View>
        )}
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