import React, { Component } from 'react';
import { 
  action, 
  observable,
  runInAction,
} from 'mobx';
import { 
  observer 
} from 'mobx-react';
import { 
  AsyncStorage,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View 
} from 'react-native';
import { 
  Container, 
  Content, 
  Spinner, 
} from 'native-base';
import { 
  HeaderWithGoBack 
} from 'components/common';
import { 
  BarangayPageCard,
  FeedTabs
} from 'components/barangay-page';
import * as localized from 'localization/en';
import {
  getBrgyById,
  followBrgy,
  unfollowBrgy
} from 'services/BrgyPageService';
import NavigationService from 'services/NavigationService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

@observer
export default class BarangayPage extends Component {
  @observable brgyId = null;
  @observable brgyData = null;

  @action
  setBrgyId(brgyId) {
    this.brgyId = brgyId;
  }

  @action
  async getBrgyData() {
    try {
      const response = await getBrgyById(this.brgyId);
      runInAction(() => this.brgyData = response.data.data);
    } catch(e) {
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  @action
  async followPage() {
    try {
      await followBrgy(this.brgyId);
      runInAction(() => this.brgyData.is_following = true);
      ToastAndroid.show(localized.FOLLOW_SUCCESS, ToastAndroid.SHORT);
    } catch(e) {
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  @action
  async unfollowPage() {
    try {
      await unfollowBrgy(this.brgyId);
      runInAction(() => this.brgyData.is_following = false);
      ToastAndroid.show(localized.UNFOLLOW_SUCCESS, ToastAndroid.SHORT);    
    } catch(e) {
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  async componentWillMount(){
    await RootStore.sessionStore.getLoggedUser();    
    const params = NavigationService.getActiveScreenParams();
    this.setBrgyId(params.brgyId);
    this.getBrgyData();
  }

  async componentWillUnmount() {
    const { brgyPageStore } = RootStore;
    await brgyPageStore.resetStore();
    await brgyPageStore.resetPage();
  }
  
  render() {
    return (
      <Container>
        <HeaderWithGoBack 
          title={this.brgyData ? this.brgyData.name : ''} 
          navigation={this.props.navigation} 
        />

        {!this.brgyData && (
          <Spinner color={colors.PRIMARY} />
        )}

        {this.brgyData && (
          <View style={styles.view}>
            <ScrollView>
              <BarangayPageCard
                id={this.brgyData.id}
                name={this.brgyData.name}
                municipality={this.brgyData.municipality}
                followingCount={this.brgyData.stats.following_count}
                followersCount={this.brgyData.stats.followers_count}
                isFollowing={this.brgyData.is_following}
                handleFollow={() => this.followPage()}
                handleUnfollow={() => this.unfollowPage()}
                email={this.brgyData.email}
                landline={this.brgyData.landline_number}
                website={this.brgyData.website}
              />
              <FeedTabs 
                brgyId={this.brgyData.id}
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
  },
});