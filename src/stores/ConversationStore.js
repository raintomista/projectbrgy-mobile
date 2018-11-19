import { action, configure, observable, runInAction } from 'mobx';
import { ToastAndroid } from 'react-native';
import { getInbox, getMessagesById } from 'services/MessagingService';
import * as localized from 'localization/en';

configure({
    enforceActions: 'always'
});

export default class ConversationStore {
  @observable chatmateId = null;
  @observable chatmateName = '';

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
    this.chatmateId = null;
    this.chatmateName = '';
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
  setChatMate(chatmateId, chatmateName) {
    this.chatmateId = chatmateId;
    this.chatmateName = chatmateName;
  }

  @action
  async getMessages() {
    this.page += 1;
    try {
      const response = await getMessagesById(this.chatmateId, this.page, this.limit, this.order, this.skip);
      runInAction(() => this.messages.push(...response.data.data.items));
    } catch (e) {
      runInAction(() => {
        this.hasMore = false;
        this.error = true;
      });
    }
  }

  @action
  addMessage(message) {
    this.skip += 1;
    this.messages.unshift(message);
  }
}