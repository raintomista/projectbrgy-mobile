import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx';
import { ScrollView, StyleSheet, ToastAndroid, View } from 'react-native';
import { Container, Spinner, Text } from 'native-base';
import { HeaderWithGoBack } from 'components/common';
import { ProfileCard } from 'components/profile';
import ProfileSharedPosts from 'screens/shared/profile/ProfileSharedPosts';
import NavigationService from 'services/NavigationService';
import { getUserById } from 'services/ProfileService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';
import * as localized from 'localization/en';

@observer
export default class ProfileAlt extends Component {
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
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  async componentWillMount(){
    const { sessionStore, profileStore } = RootStore;
    const params = NavigationService.getActiveScreenParams();
    this.setProfileId(params.profileId);
    this.getProfileData();
  }

  render() {
    return (
      <Container>
        <HeaderWithGoBack 
          title={this.profileData ? `${this.profileData.user_first_name} ${this.profileData.user_last_name}` : ''} 
          navigation={this.props.navigation} 
        />
        {!this.profileData && <Spinner color={colors.PRIMARY} />}

        {this.profileData && (
          <View style={styles.view}>
            <ScrollView>
              <ProfileCard
                id={this.profileData.user_id}
                loggedId={RootStore.sessionStore.loggedUser.user_id}
                loggedRole={RootStore.sessionStore.loggedUser.user_role}                
                name={`${this.profileData.user_first_name} ${this.profileData.user_last_name}`}
                municipality={this.profileData.barangay_page_municipality}
                followingCount={this.profileData.stats.following_count}
                region={this.profileData.barangay_page_region}
                province={this.profileData.barangay_page_province}
                barangay={this.profileData.barangay_page_name}
                barangayCaptain={this.profileData.barangay_page_captain}
                barangayAddress={this.profileData.barangay_page_office_address_street}
                email={this.profileData.user_email}
                landline={this.profileData.user_landline_number}
                mobile={this.profileData.user_mobile_number}
              />
              {(RootStore.sessionStore.loggedUser.user_role === 'barangay_page_admin' || this.profileId === RootStore.sessionStore.loggedUser.user_id) && (
                <React.Fragment>
                  <Text style={styles.label}>Shared Posts</Text>
                  <ProfileSharedPosts 
                    profileId={this.profileId}
                  />
                </React.Fragment>
              )}
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
  },
  label: {
    color: colors.DARK_GRAY,
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 15  ,
    fontFamily: fonts.LATO_BOLD,
    fontSize: 16
  }
});