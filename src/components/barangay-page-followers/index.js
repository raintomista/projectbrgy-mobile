import React from 'react';
import { observer } from 'mobx-react';
import { StyleSheet } from 'react-native';
import { ListItem,  Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import BrgyAvatar from '../../../assets/images/default-brgy.png';
import MemberAvatar from '../../../assets/images/default-member.png';
import NavigationService from 'services/NavigationService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

export const FollowButton = observer((props) => (
  <Button 
    onPress={() => RootStore.brgyPageStore.follow(props.id, props.index)} 
    style={styles.followButton} 
    rounded
  >
    <FontAwesome5 
      name="user-plus" 
      color={colors.PRIMARY} 
      size={15} 
      solid 
    />
  </Button>
));

export const FollowingButton = observer((props) => (
  <Button
    onPress={() => RootStore.brgyPageStore.unfollow(props.id, props.index)} 
    style={styles.followingButton} 
    rounded 
  >
    <FontAwesome5   
      name="user-check" 
      color={colors.LIGHT} 
      size={15} 
      solid 
    />
  </Button>
));

export const FollowFollowingButton = observer((props) => (
  <React.Fragment>
    {props.isFollowing === 1
      ? <FollowingButton id={props.id} index={props.index} />
      : <FollowButton id={props.id} index={props.index} />
    }
  </React.Fragment>
));

export const MessageButton = observer((props) => (
  <Button
    onPress={() => {}} 
    style={styles.followButton} 
    rounded 
  >
    <FontAwesome5   
      name="envelope" 
      color={colors.PRIMARY} 
      size={15} 
      solid 
    />
  </Button>
));

export const FollowersListItem = observer((props) => (
  <ListItem thumbnail onPress={() => openBarangayPage(props.id)}>
    <Left>
      <Thumbnail 
        circle 
        source={
          props.followerRole === 'barangay_member'
            ? MemberAvatar
            : BrgyAvatar
        } 
        style={styles.itemAvatar}
      />
    </Left>
    <Body style={styles.itemBody}>
      <Text style={styles.itemTitle}>{props.title}</Text>
      <Text
        style={styles.itemDetails} 
        numberOfLines={1} 
        note
      >
        {props.details}
      </Text>
    </Body>
    <Right style={styles.itemBody}>
      {props.followerRole === 'barangay_member'
        ? <MessageButton />
        : <FollowFollowingButton 
            id={props.id}
            index={props.index}
            isFollowing={props.isFollowing}
          />
      }
    </Right>
  </ListItem>
));

async function openBarangayPage(brgyId) {
  NavigationService.push('BarangayPage', { brgyId });
}

const styles = StyleSheet.create({
  itemAvatar: {
    borderColor: colors.PRIMARY,
    borderWidth: 2 ,
    paddingTop: 15,
    paddingBottom: 15
  },
  itemBody: {
    borderBottomWidth: 0,
    marginLeft: 10,
    paddingTop: 15,
    paddingBottom: 15
  },
  itemTitle: {
    color: colors.PRIMARY,
    fontFamily: fonts.MONTSERRAT_BOLD,
    fontSize: 18  
  },
  itemDetails: {
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 16
  },
  itemRight: {
    borderBottomWidth: 0 ,
    marginLeft: 10,
    paddingTop: 15,
    paddingBottom: 15
  },
  followButton: {
    backgroundColor: colors.LIGHT,
    borderColor: colors.PRIMARY,
    borderWidth: 1.5,
    paddingHorizontal: 15,
    paddingVertical: 2
  },
  followingButton: {
    backgroundColor: colors.PRIMARY,
    paddingHorizontal: 16.5,
    paddingVertical: 3.5
  }
});