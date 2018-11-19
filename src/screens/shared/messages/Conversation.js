import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx'; 
import Moment from 'moment';
import { Alert, Dimensions, FlatList, RefreshControl, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Container, Item, Input, Footer, Spinner, Root } from 'native-base';
import { HeaderWithGoBack } from 'components/common';
import { ConversationMessage } from 'components/messages';
import MessageForm from 'components/messages/MessageForm';
import NavigationService from 'services/NavigationService';

import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';
import * as localized from 'localization/en';

@observer
export default class Conversation extends Component {
  constructor(props) {
    super(props);
    this.form = new MessageForm();
  }

  async componentWillMount(){
    const params = NavigationService.getActiveScreenParams();
    await RootStore.conversationStore.setChatMate(params.chatmateId, params.chatmateName);
    this.form.$('receiver_id').set('value', params.chatmateId);
    await RootStore.sessionStore.getLoggedUser();          
    await RootStore.conversationStore.getMessages();
  }

  componentWillUnmount() {
    RootStore.conversationStore.resetStore();
  }

  renderItem = ({item, index}) => {
    const { loggedUser } = RootStore.sessionStore;
    return (
      <ConversationMessage
        index={index}
        align={loggedUser.user_id === item.sender_id ? 'right' : 'left'}
        message={item.message}
      />
    );
  }

  renderLoader(hasMore) {
    if(hasMore === false) return null;
    return <Spinner color={colors.PRIMARY}/>
  }

  renderList(messages, hasMore, refreshing) {
    return (
      <FlatList
        inverted
        ref={ref => this.flatList = ref}
        data={Array.from(messages)}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
        ListFooterComponent={() => this.renderLoader(hasMore)}
        onEndReached={() => this.handleLoadMore()}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}    
      />
    )
  }

  render() {
    const { chatmateName, messages, hasMore, refreshing } = RootStore.conversationStore;
    return (
      <Container>
        <HeaderWithGoBack 
          title={chatmateName} 
          navigation={this.props.navigation} 
        />
        <View style={styles.view}>
          {this.renderList(messages, hasMore, refreshing)}
        </View>
        <Footer style={styles.footer}>
          <Item style={styles.messageComposer} regular>
            <Input 
              onChangeText={(value) => this.handleChangeText(this.form.$('message'), value)}
              onSubmitEditing={(e) => this.handleSubmit(e)}
              maxLength={200}
              placeholder='Type a message...' 
              placeholderStyle={styles.messageComposerPlaceholder}
              style={styles.messageComposerText}
              value={this.form.$('message').value}
              multiline
            />
          </Item>
        </Footer>
      </Container>
    );
  }

  handleLoadMore() {
    if(!this.error) {
      RootStore.conversationStore.getMessages();
    }
  }

  handleChangeText(field, value) {
    field.set('value', value);
  }

  handleSubmit(e) {
    this.form.onSubmit(e)
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  footer: {
    backgroundColor: colors.LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  messageComposer: {
    borderColor: `rgba(0, 0, 0, 0.125)`,
    borderRadius: 20,
    height: 39,
    width: Dimensions.get('window').width - 16
  },
  messageComposerText: {
    fontFamily: fonts.LATO_REGULAR, 
    fontSize: 16,
    height: 39,
    marginTop: 2.5,
    paddingLeft: 10,
    paddingRight: 10
  },
  messageComposerPlaceholder: {
    fontFamily: fonts.LATO_REGULAR, 
    fontSize: 16,
    height: 39,
  },
  sendButton: {
    flexDirection: 'column', 
    height: 35, 
    justifyContent: 'space-around',
    paddingHorizontal: 15
  },
  sendButtonText: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_BOLD,
    fontSize: 15.5,
    fontWeight: 'normal'
  }
});