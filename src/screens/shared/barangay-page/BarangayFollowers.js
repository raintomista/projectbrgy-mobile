import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx';
import { AsyncStorage, FlatList, RefreshControl, StyleSheet, ToastAndroid, View } from 'react-native';
import { Container, Content, List, Spinner } from 'native-base';

import { HeaderWithGoBack } from 'components/common';
import { FollowersListItem } from 'components/barangay-page-followers';
import * as localized from 'localization/en';
import { getBrgyFollowersList, followBrgy, unfollowBrgy } from 'services/BrgyPageService';
import NavigationService from 'services/NavigationService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';

@observer
export default class BaraganyFollowers extends Component {
  @observable brgyId = null;
  @observable page = 0;
  @observable limit = 20;
  @observable order = 'desc';
  @observable hasMore = true;
  @observable error = false;  
  @observable refreshing = false;
  @observable followersList = [];

  @action
  setBrgyId(brgyId) {
    this.brgyId = brgyId;
  }

  @action
  async getFollowers() {     
    this.page += 1;
    try {
      const response = await getBrgyFollowersList(this.brgyId, this.page, this.limit, this.order);
      runInAction(() => this.followersList.push(...response.data.data.items));
    } catch (e) {
      runInAction(() => {
        this.hasMore = false;
        this.error = true;
      });
    }
  }

  @action
  async refreshFollowers() {
    this.page = 1;
    this.refreshing = true;
    try {
      const response = await getBrgyFollowersList(this.brgyId, this.page, this.limit, this.order);
      runInAction(() => {
        this.hasMore = true;
        this.error = false;        
        this.refreshing = false;
        this.followersList = response.data.data.items;        
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
        const followersList = this.followersList.slice();
        followersList[index].is_following = 1;
        this.followersList = followersList;
      });
      ToastAndroid.show(localized.FOLLOW_SUCCESS, ToastAndroid.SHORT);
    } catch(e) {
      console.log(e.response)
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  @action
  async unfollow(brgyId, index) {
    try {
      await unfollowBrgy(brgyId);
      runInAction(() => {
        const followersList = this.followersList.slice();
        followersList[index].is_following = 0;
        this.followersList = followersList;
      });
      ToastAndroid.show(localized.UNFOLLOW_SUCCESS, ToastAndroid.SHORT);    
    } catch(e) {
      console.log(e.response)
      
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  async componentWillMount(){
    await RootStore.sessionStore.getLoggedUser();
    const params = NavigationService.getActiveScreenParams();
    await this.setBrgyId(params.brgyId);
    await this.getFollowers();
  }

  renderItem = ({item, index}) => {
    const followerId = item.user_id ? item.user_id : item.barangay_page_id;
    const followerName = item.user_role === 'barangay_member' 
      ? `${item.user_first_name} ${item.user_last_name}` 
      : item.barangay_page_name;

    const followerLocation = item.barangay_page_municipality 
      + ', ' + item.barangay_page_municipality
      + ', ' + item.barangay_page_region;

    return (
      <FollowersListItem
        index={index}
        id={followerId}
        title={followerName}
        isFollowing={item.is_following}
        details={followerLocation}
        followerRole={item.user_role}
        handleFollow={() => this.follow(item.barangay_page_id, index)}
        handleUnfollow={() => this.unfollow(item.barangay_page_id, index)}
      />
    );
  }

  renderLoader(hasMore) {
    if(hasMore === false) return null;
    return <Spinner color={colors.PRIMARY}/>
  }

  renderList(followersList, hasMore, refreshing) {
    return (
      <FlatList
        data={Array.from(followersList)}
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
        <HeaderWithGoBack title="Followers" />
        <View 
          style={styles.list}
        >
          {this.renderList(this.followersList, this.hasMore, this.refreshing)}
        </View> 
      </Container>
    );
  }

  handleLoadMore() {
    if(!this.error) {
      this.getFollowers();
    }
  }

  handleRefresh() {
    this.refreshFollowers();
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  }
});