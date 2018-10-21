import React, { Component } from 'react';
import { observer } from 'mobx-react';
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
  render() {
    const { profileStore } = this.props.screenProps;
    const { followingList } = profileStore;

    return (
      <Container>
        <HeaderWithDrawer title="Following" navigation={this.props.navigation}/>
        <Content>
          {!followingList && (
            <Spinner color={colors.PRIMARY}/>
          )}
          {followingList && (
            <List dataArray={Array.from(followingList)}
              renderRow={(item, index) =>
                <FollowingListItem
                  title={item.barangay_page_name}
                  details={`${item.barangay_page_municipality}, ${item.barangay_page_province}, ${item.barangay_page_region}`}
                  isFollowing={item.is_following}
                  key={index}
                />
              }>
            </List>
          )}
        </Content>
      </Container>
    );
  }
}