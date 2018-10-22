import {
  action,
  configure,
  observable,
  runInAction
} from 'mobx';
import { ToastAndroid } from 'react-native';
import {
  getFollowingList
} from '../services/ProfileService';
import {
  followBrgy,
  unfollowBrgy
} from '../services/BrgyPageService';
import * as localized from '../localization/en';

configure({
  enforceActions: 'always'
});

export default class ProfileStore {
  @observable followingList = null;

  @action
  async initFollowing() {
    this.followingList = null;
  }

  @action
  async getFollowing(id, page, limit) {
    try {
      const response = await getFollowingList(id, page, limit, 'desc');
      runInAction(() => this.followingList = response.data.data.items);
    } catch (e) {
      const error = e.response.data;
      if (error.data.total >= 0) {
        runInAction(() => this.followingList = []);
      } else {
        runInAction(() => this.followingList = null);
      }
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
      console.log(e.response);
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