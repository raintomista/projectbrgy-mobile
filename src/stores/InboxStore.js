import { action, configure, observable, runInAction } from 'mobx';
import io from 'socket.io-client';
import { AsyncStorage, ToastAndroid } from 'react-native';
import { getInbox } from 'services/MessagingService';
import RootStore from 'stores/RootStore';
import * as localized from 'localization/en';

import API_HOST from 'config';


configure({
    enforceActions: 'always'
});

export default class InboxStore {
  @observable socket = {};
  @observable connected = false;
  @observable statusHidden = false;

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
    this.socket.disconnect();
    this.connected = false;
    this.statusHidden = false;

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
  async connect() {
    const token = await AsyncStorage.getItem('x-access-token');

    runInAction(() => {
      this.socket = io(API_HOST, {
        query: `token=${token}`
      }).connect();
    });

    this.socket.on('connect', () => {
      const { loggedUser } = RootStore.sessionStore;

      runInAction(() => {
        this.connected = true;  
      })

      if (loggedUser.user_role === 'barangay_member') {
        runInAction(() => {
          this.socket.emit('setMessengerId', { 
            messengerId: loggedUser.user_id 
          });
        });
      } else if (loggedUser.user_role === 'barangay_member_admin') {
        runInAction(() => {
          this.socket.emit('setMessengerId', { 
            messengerId: loggedUser.user_barangay_id 
          });
        });
      }

      setTimeout(() => {
        runInAction(() => {
          this.statusHidden = true;
        });
      }, 1000);
    });

    this.socket.on('server:message', (data) => {
      this.handleListen(data);
    });

    this.socket.on('disconnect', () => {
      runInAction(() => {
        this.connected = false;
        this.statusHidden = false;
      });
    });
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


  @action
  receiveMessage(message) {
    const msgIndex = this.messages.findIndex((e) => {
        if (e.sender_id === message.sender_id && e.receiver_id === message.receiver_id) {
            return e;
        } else if (e.sender_id === message.receiver_id && e.receiver_id === message.sender_id) {
            return e;
        }
        return null;            
    });
    if (msgIndex !== -1) {
        const msg = this.messages.splice(msgIndex, 1)[0];
        msg.date_created = message.date_created;
        msg.message = message.message;
        msg.receiver_id = message.sender_id;
        msg.receiver_status = message.sender_status;
        msg.sender_id = message.receiver_id;
        msg.sender_status = message.receiver_status;
        this.messages.unshift(msg);
    } else {
      const msg = {
        date_created: message.date_created,
        message: message.message,
        receiver_id: message.sender_id,
        receiver_status: message.sender_status,
        sender_id: message.receiver_id,
        sender_status: message.receiver_status,
        sender_first_name: message.sender_first_name,
        sender_last_name: message.sender_last_name
      };
      this.skip += 1;
      this.messages.unshift(msg);
    }
  }

  @action
  sendMessage(message) {

    if(this.connected) {
        this.socket.emit('client:message', message);
    }
      
    const { loggedUser } = RootStore.sessionStore;
    const { chatmate } = RootStore.conversationStore;
    let sender_id = loggedUser.user_role === 'barangay_member' ? loggedUser.user_id : loggedUser.barangay_page_id;

    const msgIndex = this.messages.findIndex((e) => {
        if (e.sender_id === message.sender_id && e.receiver_id === message.receiver_id) {
            return e;
        } else if (e.sender_id === message.receiver_id && e.receiver_id === message.sender_id) {
            return e;
        }
        return null;
    });

    if (msgIndex !== -1) {
        const msg = this.messages.splice(msgIndex, 1)[0];
        msg.date_created = message.date_created;
        msg.message = message.message;
        msg.receiver_id = message.receiver_id;
        msg.receiver_status = 'unread';
        msg.sender_id = message.sender_id;
        msg.sender_status = 'replied';
        this.messages.unshift(msg);
    } else {
        const msg = {
            date_created: message.date_created,
            message: message.message,
            receiver_id: message.receiver_id,
            receiver_status: 'unread',
            sender_id: message.sender_id,
            sender_status: 'replied',
            sender_name: chatmate.sender_name,
            sender_first_name: chatmate.sender_first_name,
            sender_last_name: chatmate.sender_last_name
        };
        this.inboxSkip += 1;
        this.messages.unshift(msg);
        }
    }

  @action
  async markAsRead(receiver_id, sender_id) {
    const msgIndex = this.messages.findIndex((e) => {
      if (e.sender_id === sender_id && e.receiver_id === receiver_id) {
        return e;
      } else if (e.sender_id === receiver_id && e.receiver_id === sender_id) {
        return e;
      }
      return null;            
    });

    if (msgIndex !== -1) {
      if(this.messages[msgIndex].sender_status === 'unread') {
        const newMessages = this.messages.slice();
        newMessages[msgIndex].sender_status = 'read';
        this.messages = newMessages;
      }
    }
  }

    
  handleListen(message) {
    const { chatmateId } = RootStore.conversationStore;

    RootStore.inboxStore.receiveMessage(message);

    if(chatmateId === message.sender_id) {
      RootStore.conversationStore.addMessage(message);
    }
  }
}