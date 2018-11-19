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

import { getMessagesById } from 'services/MessagingService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';
import * as localized from 'localization/en';

@observer
export default class Conversation extends Component {
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

  constructor(props) {
    super(props);
    this.form = new CommentForm();
  }

  async componentWillMount(){
    RootStore.sessionStore.getLoggedUser();      
    const params = NavigationService.getActiveScreenParams();
    await this.setChatMate(params.chatmateId, params.chatmateName);
    await this.getMessages();
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
    return (
      <Container>
        <HeaderWithGoBack 
          title={this.chatmateName} 
          navigation={this.props.navigation} 
        />
        <View style={styles.view}>
          {this.renderList(this.messages, this.hasMore, this.refreshing)}
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

  handleChangeText(field, value) {
    field.set('value', value);
  }

  handleViewPage(role, profileId, brgyId) {
    if(role === 'barangay_page_admin') {
      NavigationService.push('BarangayPage', { brgyId });
    } else {
      NavigationService.push('Profile', { profileId });
    }
  }

  async handleSubmit(e, hasMore, refreshing) {
    this.form.onSubmit(e)
    NavigationService.pop();
    NavigationService.navigate('Comments', { postId: this.postId });
  }

  handleLoadMore() {
    if(!this.error) {
      this.getMessages();
    }
  }

  @action
  async handleDelete(commentId, index) {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this?',
      [ 
        {text: 'Cancel'},
        {text: 'Confirm', onPress: async () => {
          try {
            await deleteComment(commentId);
            runInAction(() => {
              const newComments = this.messages.slice();
              newComments.splice(index, 1);
              this.messages = newComments;
            });
            ToastAndroid.show(localized.COMMENT_DELETE_SUCCESS, ToastAndroid.SHORT);
          } catch(e) {
            ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
          }
        }}
      ],
      { cancelable: false }
    )
  }

  formatDate(date) {
    const currentDate = Moment();
    const diffInSeconds = parseInt(Moment(date).diff(currentDate, 'seconds'), 10);
    const diffInHours = parseInt(Moment(date).diff(currentDate, 'hours'), 10);

    if (diffInHours <= -21) {
      return Moment(date).format('MMM D, YYYY [at] h:mm a');
    }
    else if (diffInHours > -21 && (diffInSeconds < -60 || diffInSeconds > -10)) {
      return Moment(date).fromNow();
    }
    else if (diffInHours > -21 && diffInSeconds <= -10) {
      return `${Math.abs(diffInSeconds)} seconds ago`;
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