import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx'; 
import Moment from 'moment';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Container, Item, Input, Footer, Spinner, Root } from 'native-base';
import { HeaderWithGoBack } from 'components/common';
import { ConversationMessage } from 'components/messages';
import CommentForm from 'components/comments/CommentForm';
import NavigationService from 'services/NavigationService';

import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';
import * as localized from 'localization/en';

@observer
export default class Conversation extends Component {
  constructor(props) {
    super(props);
    this.form = new CommentForm();
  }

  async componentWillMount(){
    const params = NavigationService.getActiveScreenParams();
    await RootStore.conversationStore.setChatMate(params.chatmateId, params.chatmateName);
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
          <Item style={styles.commentComposer} regular>
            <Input 
              onChangeText={(value) => this.handleChangeText(this.form.$('commentMessage'), value)}
              onSubmitEditing={(e) => this.handleSubmit(e, this.hasMore, this.refreshing)}
              maxLength={200}
              placeholder='Write a comment...' 
              placeholderStyle={styles.commentComposerPlaceholder}
              returnKeyLabel="Send"
              returnKeyType="send"
              style={styles.commentComposerText}
              value={this.form.$('commentMessage').value}
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
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  footer: {
    backgroundColor: colors.LIGHT,
    padding: 10  
  },
  commentComposer: {
    borderColor: `rgba(0, 0, 0, 0.125)`,
    borderRadius: 20,
    flex: 1, 
    height: 35
  },
  commentComposerText: {
    borderColor: colors.DARK_GRAY,
    fontFamily: fonts.LATO_REGULAR, 
    fontSize: 15,
    paddingLeft: 10,
    paddingRight: 10
  },
  commentComposerPlaceholder: {
    borderColor: colors.DARK_GRAY,
    fontFamily: fonts.LATO_REGULAR, 
    fontSize: 15,
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