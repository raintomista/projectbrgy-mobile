import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx'; 
import Moment from 'moment';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Container, Item, Input, Footer, Spinner, Root } from 'native-base';
import { HeaderWithGoBack } from 'components/common';
import { Comment } from 'components/comments';
import NavigationService from 'services/NavigationService';
import { getComments, deleteComment } from 'services/CommentService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';
import * as localized from 'localization/en';

@observer
export default class Comments extends Component {
  @observable postId = null;
  @observable page = 0;
  @observable limit = 20;
  @observable skip = 0;
  @observable hasMore = true;
  @observable error = false;  
  @observable refreshing = false;
  @observable comments = [];

  @action
  setPostId(postId) {
    this.postId = postId;
  }

  @action
  async getComments() {
    this.page += 1;
    try {
      const response = await getComments(this.postId, this.page, this.limit, this.skip);
      runInAction(() => this.comments.push(...response.data.data.items));
    } catch (e) {
      runInAction(() => {
        this.hasMore = false;
        this.error = true;
      });
    }
  }

  @action
  async refreshComments() {
    this.page = 1;
    this.refreshing = true;
    try {
      const response = await getComments(this.postId, this.page, this.limit, this.skip);
      runInAction(() => {
        this.hasMore = true;
        this.error = false;        
        this.refreshing = false;
        this.comments = response.data.data.items;        
      });
    } catch (e) {
      runInAction(() => this.refreshing = false);
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  async componentWillMount(){
    await RootStore.sessionStore.getLoggedUser();
    const params = NavigationService.getActiveScreenParams();
    await this.setPostId(params.postId);
    await this.getComments();
  }


  renderItem = ({item, index}) => (
    <Comment
      authorName={item.user_role === 'barangay_page_admin' ? item.barangay_page_name : `${item.user_first_name} ${item.user_last_name}`}
      authorRole={item.user_role}
      authorId={item.user_id}
      message={item.comment_message}
      dateCreated={this.formatDate(item.comment_date_created)}
      loggedUserRole={RootStore.sessionStore.loggedUser.user_role}
      loggedUserId={RootStore.sessionStore.loggedUser.user_id}
      handleDelete={() => this.handleDelete(item.comment_id, index)}
    /> 
  );

  renderLoader(hasMore) {
    if(hasMore === false) return null;
    return <Spinner color={colors.PRIMARY}/>
  }

  renderList(comments, hasMore, refreshing) {
    return (
      <FlatList
        inverted
        data={Array.from(comments)}
        renderItem={this.renderItem}
        keyExtractor={item => item.comment_id}
        ListFooterComponent={() => this.renderLoader(hasMore)}
        onEndReached={() => this.handleLoadMore()}
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
    return (
      <Container>
        <HeaderWithGoBack 
          title="Comments" 
          navigation={this.props.navigation} 
        />
        <View style={styles.view}>
          {this.renderList(this.comments, this.hasMore, this.refreshing)}
        </View>
        <Footer style={styles.footer}>
          <Item style={styles.commentComposer} regular>
            <Input 
              maxLength={200}
              placeholder='Write a comment...' 
              placeholderStyle={styles.commentComposerPlaceholder}
              returnKeyLabel="Send"
              returnKeyType="send"
              style={styles.commentComposerText}
            />
          </Item>
        </Footer>
      </Container>
    );
  }

  handleLoadMore() {
    if(!this.error) {
      this.getComments();
    }
  }
  
  async handleRefresh() {
    this.refreshComments();
  }

  @action
  async handleDelete(commentId, index) {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this?',
      [
        {text: 'Confirm', onPress: async () => {
          try {
            await deleteComment(commentId);
            runInAction(() => {
              const newComments = this.comments.slice();
              newComments.splice(index, 1);
              this.comments = newComments;
            });
            ToastAndroid.show(localized.COMMENT_DELETE_SUCCESS, ToastAndroid.SHORT);
          } catch(e) {
            ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
          }
        }},
        {text: 'Cancel'}
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