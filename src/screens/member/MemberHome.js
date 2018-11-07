import React, { Component } from 'react';
import { FlatList, Linking, RefreshControl, StyleSheet, ToastAndroid, View } from 'react-native';
import { ActionSheet, Container, Spinner } from 'native-base';
import { observer } from 'mobx-react';
import Moment from 'moment';
import { action, observable, runInAction } from 'mobx';
import { AnnouncementCard, HeaderWithDrawer, Lightbox } from 'components/common';
import NavigationService from 'services/NavigationService';
import { getNewsfeedPosts } from 'services/NewsfeedService';
import { likePost, unlikePost } from 'services/PostService';
import RootStore from 'stores/RootStore';
import * as localized from 'localization/en';
import * as colors from 'styles/colors'

@observer
export default class MemberHome extends Component {
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
      likeCount={item.like_count}
      commentCount={item.comment_count}
      shareCount={item.share_count}
      attachment={item.attachments.length == 1 ? item.attachments[0] : null}
      handleViewPage={() => this.handleViewPage(item.barangay_page_id)}
      handleOptions={() => this.handleOptions(item.barangay_page_id)}
      handleViewImage={() => this.handleViewImage(item.attachments[0].link)}
      handleToggleLike={() => this.handleToggleLike(index)}
      handleViewComments={() => this.handleViewComments(item.post_id)}
      handleShare={() => this.handleShare()}
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

  handleOptions(brgyId) {
    const BUTTONS = ['View Barangay Page', 'Cancel'];
    const CANCEL_INDEX = 1;
    ActionSheet.show({
      options: BUTTONS,
      cancelButtonIndex: CANCEL_INDEX,
    }, buttonIndex => {
      switch(buttonIndex) {
        case 0:
          this.handleViewPage(brgyId);
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
  async handleLike(postId, index) {
    try {
      await likePost(postId);
      runInAction(() => {
        const newAnnouncements = this.announcements.slice();
        newAnnouncements[index].is_liked = 1;
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
    NavigationService.navigate('Comments', { postId });
  }

  handleShare() {

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
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
  }
});