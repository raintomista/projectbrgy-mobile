import React, { Component } from 'react';
import { Alert, AsyncStorage, FlatList, Linking, RefreshControl, StyleSheet, ToastAndroid, View } from 'react-native';
import { ActionSheet, Container, Icon, Fab, Spinner } from 'native-base';
import { observer } from 'mobx-react';
import Moment from 'moment';
import numeral from 'numeral';
import { action, observable, runInAction } from 'mobx';
import { SharedPostCard, HeaderWithDrawer, Lightbox } from 'components/common';
import NavigationService from 'services/NavigationService';
import { getBrgyPageSharedPosts } from 'services/BrgyPageService';
import { deletePost, likePost, unlikePost } from 'services/PostService';
import RootStore from 'stores/RootStore';
import * as localized from 'localization/en';
import * as colors from 'styles/colors'

@observer
export default class BarangayPosts extends Component {
  @observable page = 0;
  @observable limit = 20;
  @observable order = 'desc';
  @observable hasMore = true;
  @observable error = false;  
  @observable refreshing = false;
  @observable sharedPosts = [];
  @observable imageViewerVisible = false;
  @observable images = [];

  @action
  async getSharedPosts(brgyId) {     
    this.page += 1;
    try {
      const response = await getBrgyPageSharedPosts(brgyId, this.page, this.limit, this.order);   
      runInAction(() => this.sharedPosts.push(...response.data.data.items));
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
  toggleImageViewer() {
    this.imageViewerVisible = !this.imageViewerVisible;
  }

  async componentWillMount(){
    await RootStore.sessionStore.getLoggedUser();
    await this.getSharedPosts(this.props.brgyId);
  }

  @action
  componentWillUnmount() {
    this.page = 0;
    this.limit = 20;
    this.order = 'desc';
    this.hasMore = true;
    this.error = false;  
    this.refreshing = false;
    this.sharedPosts = [];
    this.imageViewerVisible = false;
    this.images = [];
  }

  renderItem = ({item, index}) => (
    <SharedPostCard
      index={index}
      author={item.barangay_page_name}
      dateCreated={this.formatDate(item.share_date_created)}
      location={item.barangay_page_municipality}
      message={item.share_caption}
      contentAuthor={item.post_barangay_name}
      contentDateCreated={this.formatDate(item.post_date_created)}
      contentLocation={item.post_barangay_municipality}
      contentMessage={item.post_message}
      attachment={item.attachments.length == 1 ? item.attachments[0] : null}
      handleViewAuthor={() => this.handleViewPage(item.barangay_page_id)}
      handleViewContentAuthor={() => this.handleViewPage(item.post_barangay_id)}
      handleOptions={() => this.handleOptions(item.post_id, item.barangay_page_id, item.post_barangay_id, index)}
      handleViewImage={() => this.handleViewImage(item.attachments[0].link)}
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
        onEndReached={() => this.handleLoadMore(this.props.brgyId)}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}    
      />
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.imageViewerVisible && (
          <Lightbox 
            handleCloseImage={() => this.toggleImageViewer()}
            images={this.images}
            visible={this.imageViewerVisible}
          />
        )}
        <View style={styles.view}>
          {this.renderList(this.sharedPosts, this.hasMore, this.refreshing)}
        </View>
      </React.Fragment>
    );
  }

  handleLoadMore(brgyId) {
    if(!this.error) {
      this.getSharedPosts(brgyId);
    }
  }

  handleViewPage(brgyId) {
    NavigationService.push('BarangayPage', { brgyId });
  }

  async handleOptions(postId, brgyId, ogBrgyId, index) {
    const loggedBrgyId = await AsyncStorage.getItem('brgy-id');    
    const BUTTONS = ['View Original Post Author', 'Unshare Post', 'Cancel'];
     DESTRUCTIVE_INDEX = 1;
    let CANCEL_INDEX = 2;
    

    if(brgyId !== loggedBrgyId) {
      BUTTONS.splice(1, 1);
      DESTRUCTIVE_INDEX = 2;
      CANCEL_INDEX = 1;
    }

    ActionSheet.show({
      options: BUTTONS,
      destructiveButtonIndex: DESTRUCTIVE_INDEX,
      cancelButtonIndex: CANCEL_INDEX,
    }, buttonIndex => {
      switch(BUTTONS[buttonIndex]) {
        case 'View Original Post Author':
          this.handleViewPage(ogBrgyId);
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
              this.sharedPosts.splice(index, 1);
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