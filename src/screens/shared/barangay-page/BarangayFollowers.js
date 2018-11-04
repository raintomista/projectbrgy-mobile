import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { AsyncStorage, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Container, Content, List, Spinner } from 'native-base';
import { HeaderWithGoBack } from 'components/common';
import { FollowersListItem } from 'components/barangay-page-followers';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';

@observer
export default class BaraganyFollowers extends Component {
  async componentWillMount(){
    const { brgyPageStore, sessionStore } = RootStore;
    await sessionStore.getLoggedUser();
    await brgyPageStore.getFollowers();
  }

  async componentWillUnmount() {
    const { brgyPageStore } = RootStore;
    await brgyPageStore.resetStore();
  }

  renderItem = ({item, index}) => {
    const followerName = item.user_role === 'barangay_member' 
      ? `${item.user_first_name} ${item.user_last_name}` 
      : item.barangay_page_name;

    const followerLocation = item.barangay_page_municipality 
      + ', ' + item.barangay_page_municipality
      + ', ' + item.barangay_page_region;

    return (
      <FollowersListItem
        index={index}
        id={item.user_id ? item.user_id : item.barangay_page_id}
        title={followerName}
        isFollowing={item.is_following}
        details={followerLocation}
        followerRole={item.user_role}
      />
    );
  }

  renderLoader(hasMore) {
    if(hasMore === false) return null;
    return <Spinner color={colors.PRIMARY}/>
  }

  renderList() {
    const { brgyPageStore, sessionStore } = this.props.screenProps;
    const { followList, hasMore, refreshing } = brgyPageStore;
    const { loggedUser } = sessionStore;
    
    return (
      <FlatList
        data={Array.from(followList)}
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
          {this.renderList()}
        </View> 
      </Container>
    );
  }

  async handleLoadMore() {
    const { brgyPageStore } = this.props.screenProps;
    if(!brgyPageStore.error) {
      await brgyPageStore.getFollowers();
    }
  }

  async handleRefresh() {
    const { brgyPageStore, sessionStore } = this.props.screenProps;
    await brgyPageStore.refreshFollowers();
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  }
});