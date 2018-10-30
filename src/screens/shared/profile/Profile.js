import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { 
  Dimensions,
  FlatList, 
  Image, 
  RefreshControl, 
  StyleSheet,
  TouchableOpacity, 
  View 
} from 'react-native';
import { 
  Body,
  Button,
  Card, 
  CardItem, 
  Container, 
  Content, 
  List, 
  Spinner, 
  Text,
  Thumbnail
} from 'native-base';
import numeral from 'numeral';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight } from 'react-native-cross-platform-responsive-dimensions'
import MemberAvatar from '../../../../assets/images/default-member.png';
import { HeaderWithDrawer } from 'components/common';
import { FollowingListItem } from 'components/profile-following';
import NavigationService from 'services/NavigationService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

@observer
export default class Profile extends Component {
  async componentWillMount(){
    const { sessionStore, profileStore } = RootStore;
    await sessionStore.getLoggedUser();
    await profileStore.setProfileId(sessionStore.loggedUser.user_id);
    await profileStore.getProfileData();
  }

  async componentWillUnmount() {
    const { profileStore } = RootStore;
    await profileStore.resetStore();
    await profileStore.resetProfile();
  }
  
  render() {
    const { profileData } = RootStore.profileStore;

    return (
      <Container>
        <HeaderWithDrawer 
          title="Profile" 
          navigation={this.props.navigation} 
        />
        {!profileData && (
          <Spinner color={colors.PRIMARY} />
        )}

        {profileData && (
          <View style={styles.view}>
            <React.Fragment>
              <LinearGradient 
                colors={[colors.PRIMARY, colors.SECONDARY]} 
                style={styles.profileHeader}
              />
              <Thumbnail 
                circle 
                source={MemberAvatar} 
                style={styles.profileAvatar}
              />
              <Card style={styles.profileCard}>            
                <CardItem>
                  <Body>
                    <Text 
                      style={styles.profileName}
                      numberOfLines={3}
                    >
                      {`${profileData.user_first_name} ${profileData.user_last_name}`}
                    </Text>
                    <Text style={styles.profileLocation}>
                      {profileData.barangay_page_municipality}
                    </Text>  
                    <TouchableOpacity
                      style={styles.profileFollowingButton}
                      onPress={() => {
                        NavigationService.push('ProfileFollowing', {});
                      }}
                    >
                      <Text 
                        style={styles.profileFollowingLabel}
                        uppercase={false}
                      >
                        Following
                      </Text>
                      <Text
                        style={styles.profileFollowingCount}
                        uppercase={false}
                      >
                        { profileData.stats.following_count < 10000
                          ? profileData.stats.following_count
                          : numeral(profileData.stats.following_count).format('0.00a')
                        }
                      </Text>                    
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={{alignSelf: 'center'}}
                      onPress={() => {
                        NavigationService.push('ProfileInformation', {});
                      }}
                    >
                      <Text style={styles.profileSeeMore} >
                      See More
                      </Text>    
                    </TouchableOpacity>            
                  </Body>
                </CardItem>
              </Card>
            </React.Fragment>
          </View>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    height:Dimensions.get('window').height, 
    backgroundColor: colors.BACKGROUND
  },
  profileHeader: {
    position: 'absolute',
    height: 150,
    width: Dimensions.get('window').width, 
  },
  profileAvatar: {
    position: 'absolute',
    top: 65,
    alignSelf: 'center',
    borderColor: colors.PRIMARY,
    borderRadius: 100,
    borderWidth: 2,
    height: 160,
    width: 160,
    zIndex: 5,
  },
  profileCard: {
    position: 'absolute',
    top: 150,
    borderColor: colors.TRANSPARENT,
    borderWidth: 0,
    borderRadius: 0,
    elevation: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    paddingTop: 65,
    width: Dimensions.get('window').width, 
  },
  profileName: {
    alignSelf: 'center',
    color: colors.PRIMARY,
    fontFamily: fonts.MONTSERRAT_BOLD,
    fontSize: 30,
    textAlign: 'center'
  },
  profileLocation: {
    alignSelf: 'center',
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 25,
    textAlign: 'center'    
  },
  profileFollowingButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 55,
    marginTop: 15,
    paddingRight: 0
  },
  profileFollowingLabel: {
    color: colors.PRIMARY,
    fontFamily: fonts.MONTSERRAT_BOLD,
    fontSize: 22,
  },
  profileFollowingCount: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 22,
    textAlign: 'center'
  },
  profileSeeMore: {
    alignSelf: 'center',
    color: colors.PRIMARY,    
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 18,
    paddingTop: 20,
    paddingBottom: 10,
    textAlign: 'center'    
  }
});