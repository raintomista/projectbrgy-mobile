import { action, configure, observable, runInAction } from 'mobx';
import { ToastAndroid } from 'react-native';
import { getInbox, getUserById, getMessagesById } from 'services/MessagingService';
import NavigationService from 'services/NavigationService';
import * as localized from 'localization/en';

configure({
    enforceActions: 'always'
});

export default class ConversationStore {
  @observable chatmateId = null;
  @observable chatmateName = '';
  @observable chatmate = {};

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
    this.chatmate = {};
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
  setChatMate(chatmateId) {
    this.chatmateId = chatmateId;
  }

  @action
  async getUserDetails() {
    try {
      const response = await getUserById(this.chatmateId);
      const user = response.data.data;
      runInAction(() => {
        if(user.user_role === 'barangay_member') {
          this.chatmate.sender_first_name = user.user_first_name;
          this.chatmate.sender_last_name = user.user_last_name;
          this.chatmateName = `${user.user_first_name} ${user.user_last_name}`
        } else if(user.user_role === 'barangay_page_admin') {
          this.chatmate = user;
          this.chatmate.sender_name = user.barangay_page_name;
          this.chatmateName = user.barangay_page_name;
        }
      });
    } catch (e) {
      ToastAndroid.show('Message receiver not found', ToastAndroid.SHORT);
      NavigationService.navigate('Inbox', {});
    }
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