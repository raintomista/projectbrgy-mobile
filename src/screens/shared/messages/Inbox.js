import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import io from 'socket.io-client';
import { AsyncStorage, FlatList, RefreshControl, StyleSheet, View, ScrollView } from 'react-native';
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
    const authorName = `${item.sender_first_name} ${item.sender_last_name}`;
    const status = item.receiver_status;
    return (
      <InboxMessage
        id={''}
        author={authorName}
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