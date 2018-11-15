import React from 'react';
import { observer } from 'mobx-react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MemberAvatar from '../../../assets/images/default-member.png';
import NavigationService from 'services/NavigationService';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

export const InboxMessage = observer((props) => (
  <ListItem 
    thumbnail 
    style={props.status === 'unread' ? styles.unreadItem : styles.item} 
    onPress={() => NavigationService.push('BarangayPage', {brgyId: props.id})}
  >
    <Left>
      <Thumbnail 
        circle 
        source={MemberAvatar} 
        style={styles.itemAvatar}
      />
    </Left>
    <Body style={styles.itemBody}>
      <Text style={props.status === 'unread' ? styles.unreadItemTitle : styles.itemTitle} numberOfLines={1}>
        {props.author}
      </Text>
      <Text numberOfLines={1}>
        {props.status === 'replied' && (
          <React.Fragment>
            <FontAwesome5 
              name="reply" 
              color={'#808080'} 
              size={10} 
            />
            <Text note style={styles.itemMessage}>
              &nbsp;{props.message}
            </Text>
          </React.Fragment>
        )}

        {props.status !== 'replied' && (
          <Text note style={props.status === 'unread' ? styles.unreadItemMessage : styles.itemMessage}>
            {props.message}
          </Text>
        )}
      </Text>
    </Body>
    <Right style={styles.itemDetails}>
      <Text style={props.status === 'unread' ? styles.unreadItemDate : styles.itemDate} note>
        {props.dateCreated}
      </Text>
    </Right>
  </ListItem>
));
const styles = StyleSheet.create({
  item: {
    marginLeft: 0,
    paddingLeft: 17
  },
  itemAvatar: {
    borderColor: colors.PRIMARY,
    borderWidth: 2,
    height: 52,
    width: 52,
    paddingLeft: 17
  },
  itemBody: {
    borderBottomWidth: 0,
    marginLeft: 10,
    paddingTop: 15,
    paddingBottom: 15
  },
  itemDetails: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderBottomWidth: 0,
  },
  itemTitle: {
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 17  
  },
  itemMessage: {
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 15.5
  },
  itemDate: {
    alignSelf: 'flex-start',
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 15.5
  },
  unreadItem: {
    backgroundColor: colors.BACKGROUND,
    marginLeft: 0,
    paddingLeft: 17
  },
  unreadItemTitle: {
    color: colors.DARK,    
    fontFamily: fonts.LATO_BOLD,
    fontSize: 17  
  },
  unreadItemMessage: {
    color: colors.DARK,
    fontFamily: fonts.LATO_BOLD,
    fontSize: 15.5
  },
  unreadItemDate: {
    alignSelf: 'flex-start',
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 15.5
  },
});