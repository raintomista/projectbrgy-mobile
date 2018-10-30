import {
  action,
  configure,
  observable,
  runInAction
} from 'mobx';
import { ToastAndroid } from 'react-native';
import {
  getUserById,
  getFollowingList
} from 'services/ProfileService';
import {
  followBrgy,
  unfollowBrgy
} from 'services/BrgyPageService';
import * as localized from 'localization/en';

configure({
  enforceActions: 'always'
});

export default class ProfileStore {
  @observable profileId = null;
  @observable profileData = null;
  @observable page = 0;
  @observable limit = 20;
  @observable order = 'desc';
  @observable hasMore = true;
  @observable error = false;  
  @observable refreshing = false;
  @observable followingList = [];

  @action
  async resetStore() {
    this.profileId = null;
    this.profileData = null;
    this.page = 0;
    this.hasMore = true;
    this.error = false; 
    this.refreshing = false; 
    this.followingList = [];    
  }

  @action
  async setProfileId(profileId) {
    this.profileId = profileId;
  }

  @action
  async getProfileData() {
    try {
      const response = await getUserById(this.profileId);
      runInAction(() => {
        this.profileData = response.data.data;
      })
    } catch(e) {
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  @action
  async getFollowing(id) {     
    this.page += 1;
    try {
      const response = await getFollowingList(id, this.page, this.limit, this.order);
      runInAction(() => {
        this.followingList.push(...response.data.data.items);
      });
    } catch (e) {
      runInAction(() => {
        this.hasMore = false;
        this.error = true;
      });
    }
  }

  @action
  async refreshFollowing(id) {
    this.page = 1;
    this.refreshing = true;
    try {
      const response = await getFollowingList(id, this.page, this.limit, this.order);
      runInAction(() => {
        this.hasMore = true;
        this.error = false;        
        this.refreshing = false;
        this.followingList = response.data.data.items;        
      });
    } catch (e) {
      runInAction(() => this.refreshing = false);
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }
  
  @action
  async follow(brgyId, index) {
    try {
      await followBrgy(brgyId);

      /* Create a copy of the following list  
      and update the desired barangay page */
      runInAction(() => {
        const followingList = this.followingList.slice();
        followingList[index].is_following = 1;
        this.followingList = followingList;
      });

      ToastAndroid.show(localized.FOLLOW_SUCCESS, ToastAndroid.SHORT);
    } catch(e) {
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  @action
  async unfollow(brgyId, index) {
    try {
      await unfollowBrgy(brgyId);

      /* Create a copy of the following list  
      and update the desired barangay page */
      runInAction(() => {
        const followingList = this.followingList.slice();
        followingList[index].is_following = 0;
        this.followingList = followingList;
      });
      ToastAndroid.show(localized.UNFOLLOW_SUCCESS, ToastAndroid.SHORT);    
    } catch(e) {
      console.log(e);
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }
}