import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { StyleSheet } from 'react-native';
import { Container, Content, List, Spinner } from 'native-base';
import HeaderWithDrawer from '../../../components/common/HeaderWithDrawer';
import { FollowingListItem } from '../../../components/profile-following';
import * as colors from '../../../styles/colors';

@observer
export default class ProfileFollowing extends Component {
  async componentWillMount(){
    const { sessionStore, profileStore } = this.props.screenProps;
    await sessionStore.getLoggedUser();
    await profileStore.getFollowing(sessionStore.loggedUser.user_id, 1, 15);
  }

  async componentWillUnmount() {
    const { profileStore } = this.props.screenProps;
    await profileStore.initFollowing();
  }

  renderList() {
    const { profileStore } = this.props.screenProps;
    const { followingList } = profileStore;
    {console.log(followingList)}
    const items = followingList.map((item, index) => (
      <FollowingListItem
        title={item.barangay_page_name}
        details={`${item.barangay_page_municipality}, ${item.barangay_page_province}, ${item.barangay_page_region}`}
        isFollowing={item.is_following}
        navigation={this.props.navigation}
        id={item.barangay_page_id}
        index={index}
        key={index}
      />
    ));

    return (
      <List dataArray={Array.from(followingList)} style={styles.list}>
        {items}
      </List>
    )
  }

  render() {
    const { profileStore } = this.props.screenProps;
    const { followingList } = profileStore;

    return (
      <Container>
        <HeaderWithDrawer title="Following" navigation={this.props.navigation}/>
        <Content>
          {!followingList && <Spinner color={colors.PRIMARY}/>}
          {followingList && this.renderList()}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 60.5
  }
});