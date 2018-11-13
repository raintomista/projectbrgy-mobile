import React, { Component } from 'react';
import { 
  action, 
  observable,
  runInAction,
} from 'mobx';
import { 
  observer 
} from 'mobx-react';
import { AsyncStorage, FlatList, RefreshControl, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native';
import { Container, Content, Spinner } from 'native-base';
import { AnnouncementCard, HeaderWithDrawer, Lightbox } from 'components/common';
import { BarangayPageCard, FeedTabs } from 'components/barangay-page';
import {
  getBrgyById,
  getBrgyPagePosts,
  followBrgy,
  unfollowBrgy
} from 'services/BrgyPageService';
import NavigationService from 'services/NavigationService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';
import * as localized from 'localization/en';

@observer
export default class BarangayPage extends Component {
  @observable brgyId = null;
  @observable brgyData = null;

  @observable page = 0;
  @observable limit = 20;
  @observable order = 'desc';
  @observable hasMore = true;
  @observable error = false;  
  @observable refreshing = false;
  @observable brgyPosts = [];

  @action
  setBrgyId(brgyId) {
    this.brgyId = brgyId;
  }

  @action
  async getBrgyData() {
    try {
      const response = await getBrgyById(this.brgyId);
      runInAction(() => this.brgyData = response.data.data);
    } catch(e) {
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  @action
  async followPage() {
    try {
      await followBrgy(this.brgyId);
      runInAction(() => this.brgyData.is_following = true);
      ToastAndroid.show(localized.FOLLOW_SUCCESS, ToastAndroid.SHORT);
    } catch(e) {
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  @action
  async unfollowPage() {
    try {
      await unfollowBrgy(this.brgyId);
      runInAction(() => this.brgyData.is_following = false);
      ToastAndroid.show(localized.UNFOLLOW_SUCCESS, ToastAndroid.SHORT);    
    } catch(e) {
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  @action
  async getPosts() {     
    this.page += 1;
    try {
      const response = await getBrgyPagePosts(this.brgyId, this.page, this.limit, this.order);
      runInAction(() => this.followingList.push(...response.data.data.items));
    } catch (e) {
      runInAction(() => {
        this.hasMore = false;
        this.error = true;
      });
    }
  }

  async componentWillMount(){
    await RootStore.sessionStore.getLoggedUser();    
    const params = NavigationService.getStackScreenParams();
    this.setBrgyId(params.brgyId);
    this.getBrgyData();
    this.getPosts();
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
      handleOptions={() => this.handleOptions(item.barangay_page_id)}
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
        <HeaderWithDrawer title={'My Barangay'} />

        {!this.brgyData && (
          <Spinner color={colors.PRIMARY} />
        )}

        {this.brgyData && (
          <View style={styles.view}>
            <ScrollView style={{flex: 1, flexDirection: 'column'}}>
              <BarangayPageCard
                id={this.brgyData.id}
                name={this.brgyData.name}
                municipality={this.brgyData.municipality}
                followingCount={this.brgyData.stats.following_count}
                followersCount={this.brgyData.stats.followers_count}
                isFollowing={this.brgyData.is_following}
                handleFollow={() => this.followPage()}
                handleUnfollow={() => this.unfollowPage()}
                email={this.brgyData.email}
                landline={this.brgyData.landline_number}
                website={this.brgyData.website}
              />
              <FeedTabs 
                brgyId={this.brgyData.id}
              />
            </ScrollView>
          </View>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: colors.BACKGROUND
  },
});