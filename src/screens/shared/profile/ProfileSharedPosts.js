import React, { Component } from 'react';
import { Alert, AsyncStorage, FlatList, Linking, RefreshControl, StyleSheet, ToastAndroid, View } from 'react-native';
import { ActionSheet, Container, Icon, Fab, Spinner } from 'native-base';
import { observer } from 'mobx-react';
import Moment from 'moment';
import numeral from 'numeral';
import { action, observable, runInAction } from 'mobx';
import { SharedPostCard, HeaderWithDrawer, Lightbox } from 'components/common';
import NavigationService from 'services/NavigationService';
import { getUserSharedPosts } from 'services/ProfileService';
import { unsharePost } from 'services/PostService';
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
  async getSharedPosts(profileId) {     
    this.page += 1;
    try {
      const response = await getUserSharedPosts(profileId, this.page, this.limit, this.order);   
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
    await this.getSharedPosts(this.props.profileId);
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
    test={console.log(item)}
      index={index}
      author={`${item.user_first_name} ${item.user_last_name}`}
      authorRole={item.user_role}
      dateCreated={this.formatDate(item.share_date_created)}
      location={item.share_barangay_municipality}
      message={item.share_caption}
      contentAuthor={item.post_barangay_name}
      contentDateCreated={this.formatDate(item.post_date_created)}
      contentLocation={item.post_barangay_municipality}
      contentMessage={item.post_message}
      attachment={item.attachments.length == 1 ? item.attachments[0] : null}
      handleViewAuthor={() => item.user_role === 'barangay_member' ? this.handleViewProfile(item.user_id) : this.handleViewPage(item.post_barangay_id)}
      handleViewContentAuthor={() => this.handleViewPage(item.post_barangay_id)}
      handleOptions={() => this.handleOptions(item.share_id, item.share_user_id, item.post_barangay_id, index)}
      handleViewImage={() => this.handleViewImage(item.attachments[0].link)}
      handleOpenLink={() => this.handleOpenLink(item.attachments[0].link)}
      handleOpenDownloadLink={() => this.handleOpenDownloadLink(item.attachments[0].link)}
    />
  );

  renderLoader(hasMore) {
    if(hasMore === false) return null;
    return <Spinner color={colors.PRIMARY}/>
  }

  renderList(sharedPosts, hasMore, refreshing) {
    return (
      <FlatList
        data={Array.from(sharedPosts)}
        renderItem={this.renderItem}
        keyExtractor={item => item.share_id}
        ListFooterComponent={() => this.renderLoader(hasMore)}
        onEndReached={() => this.handleLoadMore(this.props.profileId)}
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

  handleLoadMore(profileId) {
    if(!this.error) {
      this.getSharedPosts(profileId);
    }
  }

  handleViewPage(brgyId) {
    NavigationService.push('BarangayPage', { brgyId });
  }

  handleViewProfile(profileId) {
    NavigationService.push('Profile', { profileId });
  }

  async handleOptions(postId, profileId, ogBrgyId, index) {
    const loggedUserId = await AsyncStorage.getItem('user-id');    
    const BUTTONS = ['View Original Post Author', 'Unshare Post', 'Cancel'];
     DESTRUCTIVE_INDEX = 1;
    let CANCEL_INDEX = 2;
    

    if(profileId !== loggedUserId) {
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
        case 'Unshare Post':
          this.handleUnshare(postId, index);
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
  async handleUnshare(postId, index) {
    Alert.alert(
      'Unshare post',
      'Are you sure you want to unshare this post?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Unshare', onPress: async () => {
          try {
            await unsharePost(postId);
            runInAction(() => {
              this.sharedPosts.splice(index, 1);
            });
            ToastAndroid.show(localized.UNSHARE_POST_SUCCESS, ToastAndroid.SHORT);      
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