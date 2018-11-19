import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import io from 'socket.io-client';
import { AsyncStorage, FlatList, RefreshControl, StyleSheet, View, ScrollView, ToastAndroid } from 'react-native';
import { Container, Content, List, Spinner, Text     } from 'native-base';
import { HeaderWithDrawer } from 'components/common';
import { InboxMessage, StatusIndicator } from 'components/messages';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';
import API_HOST from 'config';


@observer
export default class Inbox extends Component {
  @observable socket = {};
  @observable connected = false;
  @observable statusHidden = false;

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

  async componentWillMount(){
    const { sessionStore, inboxStore } = RootStore;
    await sessionStore.getLoggedUser();
    await inboxStore.getMessages();
    await this.connect();
  }

  async componentWillUnmount() {
    const { inboxStore } = RootStore;
    await inboxStore.resetStore();
  }
  renderItem = ({item, index}) => {
    const { loggedUser } = RootStore.sessionStore;
    let chatmate_id, status, logged_user_id, author_name;

    if (loggedUser.user_role === 'barangay_member') {
      chatmate_id = loggedUser.user_id === item.sender_id ? item.receiver_id : item.sender_id;
      status = loggedUser.user_id === item.sender_id ? item.sender_status : item.receiver_status;
      logged_user_id = loggedUser.user_id;
      author_name = `${item.sender_first_name} ${item.sender_last_name}`
    } else if (loggedUser.user_role === 'barangay_page_admin') {
      chatmate_id = loggedUser.barangay_page_id === item.sender_id ? item.receiver_id : item.sender_id;
      status = loggedUser.barangay_page_id === item.sender_id ? item.sender_status : item.receiver_status;
      logged_user_id = loggedUser.barangay_page_id;
      author_name = item.sender_name;
    }

    return (
      <InboxMessage
        id={chatmate_id}
        author={author_name}
        message={item.message} 
        dateCreated={this.formatDate(item.date_created)}
        status={status}
      />
    );
  }

  renderLoader(hasMore) {
    if(hasMore === false) return null;
    return <Spinner color={colors.PRIMARY} style={{zIndex: 0}}/>
  }

  renderList(messages, hasMore, refreshing, error) {
    return (
      <FlatList
        data={Array.from(messages)}
        renderItem={this.renderItem}
        keyExtractor={item => item.sender_id}
        ListFooterComponent={() => this.renderLoader(hasMore)}
        onEndReached={() => this.handleLoadMore(error)}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}    
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => this.handleRefresh()}
            colors={[colors.PRIMARY]}
          />
        }
      />
    )
  }

  render() {
    const { inboxStore } = RootStore;
    const { messages, hasMore, refreshing, error } = inboxStore; 
    return (
      <Container>
        <HeaderWithDrawer title="Messages" navigation={this.props.navigation}/>
        <View style={styles.list}>
          {!this.statusHidden && <StatusIndicator connected={this.connected} />}   
          <View style={styles.list}>
            {this.renderList(messages, hasMore, refreshing, error)}
          </View>           
        </View> 
      </Container>
    );
  }

  async handleLoadMore(error) {
    if(!error) {
      await RootStore.inboxStore.getMessages();
    }
  }

  async handleRefresh() {
    await RootStore.inboxStore.refreshMessages();
  }

  handleListen(message) {
    const { chatmateId } = RootStore.conversationStore;

    RootStore.inboxStore.receiveMessage(message);

    if(chatmateId === message.sender_id) {
      RootStore.conversationStore.receiveMessage(message);
    }
  }

  formatDate(date) {
    const today = moment();
    const daysElapsed = moment(today).diff(date, 'days');

    if(daysElapsed < 1) {
      return moment(date).format('hh:mm a');
    }
    else if(daysElapsed <= 365) {
      return moment(date).format('DD MMM')
    } 

    return moment(date).fromNow();
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  }
});