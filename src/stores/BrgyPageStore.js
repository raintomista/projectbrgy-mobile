import {
  action,
  configure,
  observable,
  runInAction
} from 'mobx';
import { ToastAndroid } from 'react-native';
import {
  getBrgyById,
  getBrgyFollowingList,
  getBrgyFollowersList,
  followBrgy,
  unfollowBrgy
} from 'services/BrgyPageService';
import * as localized from 'localization/en';

configure({
  enforceActions: 'always'
});

export default class BrgyPageStore {
  @observable brgyId = null;
  @observable brgyData = null;
  @observable page = 0;
  @observable limit = 20;
  @observable order = 'desc';
  @observable hasMore = true;
  @observable error = false;  
  @observable refreshing = false;
  @observable followList = [];

  @action 
  async resetPage() {
    this.brgyData = null;
  }

  @action
  async resetStore() {
    this.page = 0;
    this.hasMore = true;
    this.error = false; 
    this.refreshing = false; 
    this.followList = [];    
  }

  @action
  async setBrgyId(brgyId) {
    this.brgyId = brgyId;
  }

  @action
  async getBrgyData() {
    try {
      const response = await getBrgyById(this.brgyId);
      runInAction(() => {
        this.brgyData = response.data.data;
      })
    } catch(e) {
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  @action
  async getFollowing() {     
    this.page += 1;
    try {
      const response = await getBrgyFollowingList(this.brgyId, this.page, this.limit, this.order);
      runInAction(() => {
        this.followList.push(...response.data.data.items);
      });
    } catch (e) {
      runInAction(() => {
        this.hasMore = false;
        this.error = true;
      });
    }
  }

  @action
  async getBrgyData() {
    try {
      const response = await getBrgyById(this.brgyId);
      runInAction(() => {
        this.brgyData = response.data.data;
      })
    } catch(e) {
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  @action
  async getFollowers() {     
    this.page += 1;
    try {
      const response = await getBrgyFollowersList(this.brgyId, this.page, this.limit, this.order);
      runInAction(() => {
        this.followList.push(...response.data.data.items);
      });
    } catch (e) {
      runInAction(() => {
        this.hasMore = false;
        this.error = true;
      });
    }
  }

  @action
  async refreshFollowers(id) {
    this.page = 1;
    this.refreshing = true;
    try {
      const response = await getBrgyFollowersList(this.brgyId, this.page, this.limit, this.order);
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
  async refreshFollowing(id) {
    this.page = 1;
    this.refreshing = true;
    try {
      const response = await getBrgyFollowingList(this.brgyId, this.page, this.limit, this.order);
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
        const followList = this.followList.slice();
        followList[index].is_following = 1;
        this.followList = followList;
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
        const followList = this.followList.slice();
        followList[index].is_following = 0;
        this.followList = followList;
      });
      ToastAndroid.show(localized.UNFOLLOW_SUCCESS, ToastAndroid.SHORT);    
    } catch(e) {
      console.log(e);
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }
}