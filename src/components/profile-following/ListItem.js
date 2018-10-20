import React from 'react';
import { ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import MemberAvatar from '../../../assets/images/default-member.png';

const ProfileFollowingListItem = (props) => (
  <ListItem thumbnail>
    <Left>
      <Thumbnail square source={MemberAvatar} />
    </Left>
    <Body>
      <Text>Cardo Dalisay</Text>
      <Text note numberOfLines={1}>Its time to build a difference . .</Text>
    </Body>
    <Right>
      <Button transparent>
        <Text>Following</Text>
      </Button>
    </Right>
  </ListItem>
);

export default ProfileFollowingListItem;