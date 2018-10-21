import {
  action,
  configure,
  observable,
  runInAction
} from 'mobx';
import {
  getFollowingList
} from '../services/ProfileService';

configure({
  enforceActions: 'always'
});

export default class ProfileStore {
  @observable followingList = null;

  @action
  async getFollowing(id) {
    try {
      const response = await getFollowingList(id, 1, 15, 'desc');
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
}