import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Container, Content, List, Spinner } from 'native-base';
import { HeaderWithDrawer } from 'components/common';
import { FollowingListItem } from 'components/profile-following';
import * as colors from 'styles/colors';

@observer
export default class ProfileFollowing extends Component {
  async componentWillMount(){
    const { sessionStore, profileStore } = this.props.screenProps;
    await sessionStore.getLoggedUser();
    await profileStore.getFollowing(sessionStore.loggedUser.user_id);
  }

  async componentWillUnmount() {
    const { profileStore } = this.props.screenProps;
    await profileStore.resetStore();
  }

  renderItem = ({ item, index}) => (
    <FollowingListItem
      index={index}
      id={item.barangay_page_id}
      title={item.barangay_page_name}
      isFollowing={item.is_following}
      details={`${item.barangay_page_municipality}, ${item.barangay_page_province}, ${item.barangay_page_region}`}
    />
  );

  renderLoader() {
    const { profileStore } = this.props.screenProps;
    const { error, followingList, hasMore, } = profileStore;
    if(hasMore === false) return null;
    return <Spinner color={colors.PRIMARY}/>
  }

  renderList() {
    const { profileStore, sessionStore } = this.props.screenProps;
    const { followingList, refreshing } = profileStore;
    const { loggedUser } = sessionStore;
    
    return (
      <FlatList
        data={Array.from(followingList)}
        renderItem={this.renderItem}
        keyExtractor={item => item.barangay_page_id}
        ListFooterComponent={() => this.renderLoader()}
        onEndReached={() => this.handleLoadMore()}
        onEndReachedThreshold={0.5}    
        removeClippedSubviews={true}
      />
    )
  }

  render() {
    const { profileStore } = this.props.screenProps;
    const { followingList, hasMore } = profileStore;

    return (
      <Container>
        <HeaderWithDrawer title="Following" navigation={this.props.navigation}/>
        <View style={styles.list}>
          {this.renderList()}
        </View> 
      </Container>
    );
  }

  async handleLoadMore() {
    const { profileStore, sessionStore } = this.props.screenProps;
    if(!profileStore.error) {
      await profileStore.getFollowing(sessionStore.loggedUser.user_id);
    }
  }

  async handleRefresh() {
    const { profileStore, sessionStore } = this.props.screenProps;
    await profileStore.refreshFollowing(sessionStore.loggedUser.user_id);
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  }
});