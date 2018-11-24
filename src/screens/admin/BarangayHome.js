import React, { Component } from 'react';
import { Alert, AsyncStorage, FlatList, Linking, RefreshControl, StyleSheet, ToastAndroid, View } from 'react-native';
import { ActionSheet, Container, Icon, Fab, Spinner } from 'native-base';
import { observer } from 'mobx-react';
import Moment from 'moment';
import numeral from 'numeral';
import { action, observable, runInAction } from 'mobx';
import { AnnouncementCard, HeaderWithDrawer, Lightbox, EmptyState } from 'components/common';
import NavigationService from 'services/NavigationService';
import { getNewsfeedPosts } from 'services/NewsfeedService';
import { deletePost, likePost, unlikePost } from 'services/PostService';
import RootStore from 'stores/RootStore';
import * as localized from 'localization/en';
import * as colors from 'styles/colors'

@observer
export default class BarangayHomeF extends Component {
  @observable page = 0;
  @observable limit = 20;
  @observable order = 'desc';
  @observable hasMore = true;
  @observable error = false;  
  @observable refreshing = false;
  @observable announcements = [];
  @observable imageViewerVisible = false;
  @observable images = [];

  @action
  async getNewsfeed() {     
    this.page += 1;
    try {
      const response = await getNewsfeedPosts(this.page, this.limit, this.order);      
      runInAction(() => this.announcements.push(...response.data.data.items));
      if(response.data.data.items.length === 0) {
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
  async refreshNewsfeed() {
    this.page = 1;
    this.refreshing = true;
    try {
      const response = await getNewsfeedPosts(this.page, this.limit, this.order);
      runInAction(() => {
        this.hasMore = true;
        this.error = false;        
        this.refreshing = false;
        this.announcements = response.data.data.items;        
      });
    } catch (e) {
      runInAction(() => this.refreshing = false);
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  @action
  toggleImageViewer() {
    this.imageViewerVisible = !this.imageViewerVisible;
  }

  async componentWillMount(){
    await RootStore.sessionStore.getLoggedUser();
    await this.getNewsfeed();
  }

  renderItem = ({item, index}) => (
    <AnnouncementCard 
      index={index}
      author={item.barangay_page_name}
      dateCreated={this.formatDate(item.post_date_created)}
      location={item.barangay_page_municipality}
      message={item.post_message}
      isLiked={item.is_liked}
      likeCount={this.formatValue(item.like_count)}
      commentCount={this.formatValue(item.comment_count)}
      shareCount={this.formatValue(item.share_count)}
      attachment={item.attachments.length == 1 ? item.attachments[0] : null}
      handleViewPage={() => this.handleViewPage(item.barangay_page_id)}
      handleOptions={() => this.handleOptions(item.post_id, item.barangay_page_id, index)}
      handleViewImage={() => this.handleViewImage(item.attachments[0].link)}
      handleToggleLike={() => this.handleToggleLike(index)}
      handleViewComments={() => this.handleViewComments(item.post_id)}
      handleShare={() => this.handleShare(item.post_id)}
      handleOpenLink={() => this.handleOpenLink(item.attachments[0].link)}
      handleOpenDownloadLink={() => this.handleOpenDownloadLink(item.attachments[0].link)}
    />
  );

  renderLoader(hasMore) {
    if(hasMore === false) return null;
    return <Spinner color={colors.PRIMARY}/>
  }

  renderList(announcements, hasMore, refreshing) {
    return (
      <FlatList
        data={Array.from(announcements)}
        renderItem={this.renderItem}
        keyExtractor={item => item.post_id}
        ListEmptyComponent={
          this.error && (
            <EmptyState 
              title="Newsfeed is Empty!"
              detail="Start following barangay pages."
            />
          )
        }
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
        {this.imageViewerVisible && (
          <Lightbox 
            handleCloseImage={() => this.toggleImageViewer()}
            images={this.images}
            visible={this.imageViewerVisible}
          />
        )}
        <HeaderWithDrawer title="Home" />
        <View style={styles.view}>
          {this.renderList(this.announcements, this.hasMore, this.refreshing)}
        </View>
        <Fab
          style={{ backgroundColor: colors.PRIMARY }}
          position="bottomRight"
          onPress={() => {
            NavigationService.push('CreateAnnouncement', { reportId: this.reportId });
          }}
        >
          <Icon name="add" />
        </Fab>
      </Container>
    );
  }

  handleLoadMore() {
    if(!this.error) {
      this.getNewsfeed();
    }
  }

  handleRefresh() {
    this.refreshNewsfeed();
  }

  handleViewPage(brgyId) {
    NavigationService.navigate('BarangayPage', { brgyId });
  }

  async handleOptions(postId, brgyId, index) {
    const loggedBrgyId = await AsyncStorage.getItem('brgy-id');    
    const BUTTONS = ['View Barangay Page', 'Delete Post', 'Cancel'];
    const DESTRUCTIVE_INDEX = 1;
    let CANCEL_INDEX = 2;
    

    if(brgyId !== loggedBrgyId) {
      BUTTONS.splice(1, 1);
      CANCEL_INDEX = 1;
    }

    ActionSheet.show({
      options: BUTTONS,
      destructiveButtonIndex: DESTRUCTIVE_INDEX,
      cancelButtonIndex: CANCEL_INDEX,
    }, buttonIndex => {
      switch(BUTTONS[buttonIndex]) {
        case 'View Barangay Page':
          this.handleViewPage(brgyId);
          break;
        case 'Delete Post':
          this.handleDelete(postId, index);
          break;
      }
    });
  }

  @action
  handleViewImage(url) {
    const imageUrl = url.replace('?dl=0', '?dl=1');
    this.images = [{url: imageUrl}];
    this.toggleImageViewer();
  }

  @action 
  async handleDelete(postId, index) {
    Alert.alert(
      'Delete announcement',
      'Are you sure you want to delete this announcement?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: async () => {
          try {
            await deletePost(postId);
            runInAction(() => {
              this.announcements.splice(index, 1);
            });
            ToastAndroid.show(localized.DELETE_POST_SUCCESS, ToastAndroid.SHORT);      
          } catch(e) {
            ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
          }
        }},
      ],
      { cancelable: false }
    );
  }

  @action
  async handleLike(postId, index) {
    try {
      await likePost(postId);
      runInAction(() => {
        const newAnnouncements = this.announcements.slice();
        newAnnouncements[index].is_liked = 1;
        newAnnouncements[index].like_count += 1;
        this.announcements = newAnnouncements;
      });
    } catch(e) {      
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  @action
  async handleUnlike(postId, index) {
    try {
      await unlikePost(postId);
      runInAction(() => {
        const newAnnouncements = this.announcements.slice();
        newAnnouncements[index].is_liked = 0;
        newAnnouncements[index].like_count -= 1;
        this.announcements = newAnnouncements;
      });
    } catch(e) {
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  @action
  handleToggleLike(index) {
    const post = this.announcements[index];
    if(post.is_liked === 0) {
      this.handleLike(post.post_id, index);
    } else {
      this.handleUnlike(post.post_id, index);      
    }
  }

  handleViewComments(postId) {
    NavigationService.push('Comments', { postId });
  }

  handleShare(postId) {
    NavigationService.navigate('Share', { postId });
  }

  handleOpenLink(url) {
    Linking.openURL(url);
  }

  handleOpenDownloadLink(url) {
    const downloadUrl = url.replace('?dl=0', '?dl=1');
    Linking.openURL(downloadUrl);
  }

  formatDate(date) {
    const currentDate = Moment();
    const diff = Moment(date).diff(currentDate, 'hours');

    if (parseInt(diff, 10) <= -21) {
      return Moment(date).format('MMM D, YYYY [at] h:mm a');
    } else {
      return Moment(date).fromNow();
    }
  }

  formatValue(value) {
    if(value < 10000) {
      return value;
    }

    return numeral(value).format('0.0a');
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
  }
});