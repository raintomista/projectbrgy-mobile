import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx'; 
import Moment from 'moment';
import { Alert, Dimensions, FlatList, RefreshControl, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Container, Item, Input, Footer, Spinner, Root } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { HeaderWithGoBack, EmptyStateAlt } from 'components/common';
import { ConversationMessage, StatusIndicator } from 'components/messages';
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
    await RootStore.conversationStore.setChatMate(params.chatmateId);
    if(params.chatmateRole === 'barangay_page_admin') {
      await RootStore.conversationStore.getBrgyDetails();
    } else if(params.chatmateRole === 'barangay_member') {
      await RootStore.conversationStore.getUserDetails();
    }
    this.form.$('receiver_id').set('value', params.chatmateId);
    this.form.$('message').set('extra', this.flatList);
    await RootStore.sessionStore.getLoggedUser();          
    await RootStore.conversationStore.getMessages();
  }

  componentWillUnmount() {
    RootStore.conversationStore.resetStore();
  }

  renderItem = ({item, index}) => {
    const { loggedUser } = RootStore.sessionStore;
    const loggedId = loggedUser.user_role === 'barangay_member' ? loggedUser.user_id : loggedUser .barangay_page_id;
    return (
      <ConversationMessage
        align={loggedId === item.sender_id ? 'right' : 'left'}
        message={item.message}
      />
    );
  }

  renderLoader(hasMore) {
    if(hasMore === false) return null;
    return <Spinner color={colors.PRIMARY}/>
  }

  renderList(messages, hasMore, refreshing, error) {
    return (
      <FlatList
        inverted
        contentContainerStyle={{paddingTop: 20, paddingBottom: 20}}
        ref={ref => this.flatList = ref}
        data={Array.from(messages)}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          error && (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', height: Dimensions.get('window').height - 56 - 56 - 20}}>
              <EmptyStateAlt
                title="No messages yet"
                detail="Be the first one to send a message" 
              />
            </View>
          )}
        ListFooterComponent={() => this.renderLoader(hasMore)}
        onEndReached={() => this.handleLoadMore(error)}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}    
        ref={(flatList) => { this.flatList = flatList }}
      />
    )
  }

  render() {
    const { 
      chatmateName, 
      messages, 
      hasMore, 
      refreshing,
      error
    } = RootStore.conversationStore;
    const { 
      statusHidden, 
      connected, 
    } = RootStore.inboxStore;

    const charCount = 200 - this.form.$('message').value.length;
    const disabled = charCount === 200 || charCount < 0;

    return (
      <Container>
        <HeaderWithGoBack 
          title={chatmateName} 
          navigation={this.props.navigation} 
        />
        <View style={styles.view}>
          {!statusHidden && <StatusIndicator connected={connected} />}   
          <View style={styles.view}>
            {this.renderList(messages, hasMore, refreshing, error)}
          </View>
        </View>
        <Footer style={styles.footer}>
          <Input 
            maxLength={200}
            multiline={true}        
            onChangeText={(value) => this.handleChangeText(this.form.$('message'), value)}              
            placeholder='Type a message...'
            placeholderStyle={styles.messageComposerPlaceholder}
            style={styles.messageComposerText}
            value={this.form.$('message').value}
            onSubmitEditing={(e) => this.handleSubmit(e)}    
            disabled={!statusHidden}                      
          />
          <TouchableOpacity 
            onPress={(e) => this.form.onSubmit(e)}
            style={styles.sendButton}
            disabled={!statusHidden || disabled}
          >
            <FontAwesome5 
              name="paper-plane" 
              color={ disabled ? colors.DARK_GRAY : colors.PRIMARY } 
              size={20} 
              solid 
            />
          </TouchableOpacity>
        </Footer>
      </Container>
    );
  }

  handleLoadMore(error) {
    if(!error) {
      RootStore.conversationStore.getMessages();
    }
  }

  handleChangeText(field, value) {
    field.set('value', value);
  }

  handleSubmit(e) {
    this.form.onSubmit(e);
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  footer: {
    backgroundColor: colors.LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 8,
    height: null,
    minHeight: 55,
    maxHeight: 104.5
  },
  messageComposerText: {
    fontFamily: fonts.LATO_REGULAR, 
    fontSize: 16,
    textAlignVertical: 'top',    
    width: Dimensions.get('window').width - 16
  },
  messageComposerPlaceholder: {
    fontFamily: fonts.LATO_REGULAR, 
    fontSize: 16,
  },
  sendButton: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingBottom: 3
  },
});