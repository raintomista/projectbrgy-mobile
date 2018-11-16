import { action, configure, observable, runInAction } from 'mobx';
import { ToastAndroid } from 'react-native';
import { getInbox } from 'services/MessagingService';
import * as localized from 'localization/en';

configure({
    enforceActions: 'always'
});

export default class InboxStore {
  @observable page = 0;
  @observable limit = 20;
  @observable order = 'desc';
  @observable skip = 0;
  @observable hasMore = true;
  @observable error = false;
  @observable refreshing = false;
  @observable messages = [];
  
  @action
  resetStore() {
    this.page = 0;
    this.limit = 20;
    this.order = 'desc';
    this.skip = 0;
    this.hasMore = true;
    this.error = false;
    this.refreshing = false;
    this.messages = [];
  }

  @action
  async getMessages() {
    this.page += 1;
    try {
      const response = await getInbox(this.page, this.limit, this.order, this.skip);
      
      if(response.data.data.items.length > 0) {
        runInAction(() => {
            this.messages.push(...response.data.data.items);
        });
      } else {
        runInAction(() => {
          this.hasMore = false;
          this.error = true;
        });
      }

    } catch (e) {
      runInAction(() => {
          this.hasMore = false;
          this.error = true;
      });
    }
  }

  @action
  async refreshMessages() {
    this.page = 1;
    this.skip = 0;
    this.refreshing = true;
    try {
        const response = await getInbox(this.page, this.limit, this.order, this.skip);
        runInAction(() => {
            this.hasMore = true;
            this.error = false;
            this.refreshing = false;
            this.messages = response.data.data.items;
        });
    } catch (e) {
        runInAction(() => this.refreshing = false);
        ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }
}