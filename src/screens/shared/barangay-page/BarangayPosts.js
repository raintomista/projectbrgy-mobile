import React, { Component } from 'react';
import { action, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { AsyncStorage, FlatList, RefreshControl, StyleSheet, ToastAndroid, View } from 'react-native';
import { Container, Content, Spinner } from 'native-base';
import { AnnouncementCard, Lightbox } from 'components/common';
import { getBrgyPagePosts } from 'services/BrgyPageService';
import NavigationService from 'services/NavigationService';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';
import * as localized from 'localization/en';

@observer
export default class BarangayPage extends Component {
  @observable page = 0;
  @observable limit = 20;
  @observable order = 'desc';
  @observable hasMore = true;
  @observable error = false;  
  @observable refreshing = false;
  @observable brgyPosts = [];

  @action
  async getPosts(brgyId) {     
    this.page += 1;
    try {
      const response = await getBrgyPagePosts(brgyId, this.page, this.limit, this.order);
      console.log(response)
      runInAction(() => this.brgyPosts.push(...response.data.data.items));
    } catch (e) {
      console.log(e)
      console.log(e.response);
      runInAction(() => {
        this.hasMore = false;
        this.error = true;
      });
    }
  }

  async componentWillMount(){
    this.getPosts(this.props.brgyId);
  }

  renderItem = ({item, index}) => (
    <AnnouncementCard 
      index={index}
      author={item.barangay_page_name}
      // dateCreated={this.formatDate(item.post_date_created)}
      location={item.barangay_page_municipality}
      message={item.post_message}
      isLiked={item.is_liked}
      // likeCount={this.formatValue(item.like_count)}
      // commentCount={this.formatValue(item.comment_count)}
      // shareCount={this.formatValue(item.share_count)}
      // attachment={item.attachments.length == 1 ? item.attachments[0] : null}
      // handleViewPage={() => this.handleViewPage(item.barangay_page_id)}
      // handleOptions={() => this.handleOptions(item.barangay_page_id)}
      // handleViewImage={() => this.handleViewImage(item.attachments[0].link)}
      // handleToggleLike={() => this.handleToggleLike(index)}
      // handleViewComments={() => this.handleViewComments(item.post_id)}
      // handleShare={() => this.handleShare(item.post_id)}
      // handleOpenLink={() => this.handleOpenLink(item.attachments[0].link)}
      // handleOpenDownloadLink={() => this.handleOpenDownloadLink(item.attachments[0].link)}
    />
  );

  renderLoader(hasMore) {
    if(hasMore === false) return null;
    return <Spinner color={colors.PRIMARY}/>
  }

  renderList(brgyPosts, hasMore, refreshing) {
    return (
      <FlatList
        style={styles.flatList}
        data={Array.from(brgyPosts)}
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
      <React.Fragment>
        {this.renderList(this.brgyPosts, this.hasMore, this.refreshing)}
      </React.Fragment>
    );
  }

  handleLoadMore() {
    if(!this.error) {
      this.getPosts();
    }
  }

  handleRefresh() {
    // this.refreshNewsfeed();
  }
}

const styles = StyleSheet.create({
  flatList: {
    backgroundColor: colors.BACKGROUND
  }
});