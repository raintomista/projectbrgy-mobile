import React, { Component } from 'react';
import { Container, Content, List, } from 'native-base';
import HeaderWithDrawer from '../../../components/common/HeaderWithDrawer';
import ListItem from '../../../components/profile-following/ListItem';

import { getFollowingList } from '../../../services/MemberProfileService';

export default class ProfileFollowing extends Component {
  render() {
    return (
      <Container>
        <HeaderWithDrawer title="Following" navigation={this.props.navigation}/>
        <Content>
          <List>
            <ListItem />
          </List>
        </Content>
      </Container>
    );
  }
}