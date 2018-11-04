import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx';
import { AsyncStorage, FlatList, RefreshControl, StyleSheet, ToastAndroid, View } from 'react-native';
import { Container, Content, List, Spinner } from 'native-base';

import { HeaderWithGoBack } from 'components/common';
import { FollowingListItem } from 'components/barangay-page-following';
import * as localized from 'localization/en';
import { getBrgyFollowingList, followBrgy, unfollowBrgy } from 'services/BrgyPageService';
import NavigationService from 'services/NavigationService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';

@observer
export default class BarangayFollowing extends Component {
  @observable brgyId = null;
  @observable page = 0;
  @observable limit = 20;
  @observable order = 'desc';
  @observable hasMore = true;
  @observable error = false;  
  @observable refreshing = false;
  @observable followingList = [];

  @action
  setBrgyId(brgyId) {
    this.brgyId = brgyId;
  }

  @action
  async getFollowing() {     
    this.page += 1;
    try {
      const response = await getBrgyFollowingList(this.brgyId, this.page, this.limit, this.order);
      runInAction(() => this.followingList.push(...response.data.data.items));
    } catch (e) {
      runInAction(() => {
        this.hasMore = false;
        this.error = true;
      });
    }
  }

  @action
  async refreshFollowing() {
    this.page = 1;
    this.refreshing = true;
    try {
      const response = await getBrgyFollowingList(this.brgyId, this.page, this.limit, this.order);
      runInAction(() => {
        this.hasMore = true;
        this.error = false;        
        this.refreshing = false;
        this.followingList = response.data.data.items;        
      });
    } catch (e) {
      runInAction(() => this.refreshing = false);
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  @action
  async follow(brgyId, index) {
    try {
      await followBrgy(brgyId);
      runInAction(() => {
        const followingList = this.followingList.slice();
        followingList[index].is_following = 1;
        this.followingList = followingList;
      });
      ToastAndroid.show(localized.FOLLOW_SUCCESS, ToastAndroid.SHORT);
    } catch(e) {
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  @action
  async unfollow(brgyId, index) {
    try {
      await unfollowBrgy(brgyId);
      runInAction(() => {
        const followingList = this.followingList.slice();
        followingList[index].is_following = 0;
        this.followingList = followingList;
      });
      ToastAndroid.show(localized.UNFOLLOW_SUCCESS, ToastAndroid.SHORT);    
    } catch(e) {
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  async componentWillMount(){
    await RootStore.sessionStore.getLoggedUser();
    const params = NavigationService.getActiveScreenParams();
    await this.setBrgyId(params.brgyId);
    await this.getFollowing();
  }

  renderItem = ({item, index}) => (
    <FollowingListItem
      index={index}
      id={item.barangay_page_id}
      title={item.barangay_page_name}
      isFollowing={item.is_following}
      details={`${item.barangay_page_municipality}, ${item.barangay_page_province}, ${item.barangay_page_region}`}
      handleFollow={() => this.follow(item.barangay_page_id, index)}
      handleUnfollow={() => this.unfollow(item.barangay_page_id, index)}
    />
  );

  renderLoader(hasMore) {
    if(hasMore === false) return null;
    return <Spinner color={colors.PRIMARY}/>
  }

  renderList(followingList, hasMore, refreshing) {
    return (
      <FlatList
        data={Array.from(followingList)}
        renderItem={this.renderItem}
        keyExtractor={item => item.user_id ? item.user_id : item.barangay_page_id}
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
        <HeaderWithGoBack title="Following" />
        <View style={styles.list}>
          {this.renderList(this.followingList, this.hasMore, this.refreshing)}
        </View> 
      </Container>
    );
  }

  handleLoadMore() {
    if(!this.error) {
      this.getFollowing();
    }
  }

  handleRefresh() {
    this.refreshFollowing();
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  }
});