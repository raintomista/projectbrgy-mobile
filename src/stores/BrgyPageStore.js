import {
    action,
    configure,
    observable,
    runInAction
  } from 'mobx';
  import { ToastAndroid } from 'react-native';
  import {
    getBrgyById
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
    @observable followingList = [];
  
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
      this.followingList = [];    
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
  
  }