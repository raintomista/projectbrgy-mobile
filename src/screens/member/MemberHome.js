import React, { Component } from 'react';
import { FlatList, Linking, RefreshControl, StyleSheet, ToastAndroid, View } from 'react-native';
import { Container, Spinner } from 'native-base';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx';
import { AnnouncementCard, HeaderWithDrawer } from 'components/common';
import { getNewsfeedPosts } from 'services/DashboardService';
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

  async componentWillMount(){
    await RootStore.sessionStore.getLoggedUser();
    await this.getNewsfeed();
  }

  renderItem = ({item, index}) => (
    <AnnouncementCard 
      index={index}
      author={item.barangay_page_name}
      dateCreated={item.post_date_created}
      location={item.barangay_page_municipality}
      message={item.post_message}
      isLiked={item.is_liked}
      likeCount={item.like_count}
      commentCount={item.comment_count}
      shareCount={item.share_count}
      attachment={item.attachments.length == 1 ? item.attachments[0] : null}
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

  handleOpenLink(url) {
    Linking.openURL(url);
  }

  handleOpenDownloadLink(url) {
    const downloadUrl = url.replace('?dl=0', '?dl=1');
    Linking.openURL(downloadUrl);
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
  }
});