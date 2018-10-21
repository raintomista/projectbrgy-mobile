import React from 'react';
import { ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import MemberAvatar from '../../../assets/images/default-member.png';

const ProfileFollowingListItem = (props) => (
  <ListItem thumbnail>
    <Left>
      <Thumbnail square source={MemberAvatar} />
    </Left>
    <Body>
      <Text>{props.title}</Text>
      <Text numberOfLines={1} note>
        {props.details}
      </Text>
    </Body>
    <Right>
      <Button transparent>
        <Text>Following</Text>
      </Button>
    </Right>
  </ListItem>
);

export default ProfileFollowingListItem;