import React from 'react';
import { observer } from 'mobx-react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Badge, CardItem, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import BrgyAvatar from '../../../assets/images/default-brgy.png';
import MemberAvatar from '../../../assets/images/default-member.png';
import NavigationService from 'services/NavigationService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';



export const ConversationMessage = observer((props) => (
  <CardItem style={styles.messageContainer}>
    <Body>
      <Badge style={props.align === 'right' ? styles.messageBubble : styles.messageAltBubble}>
        <Text style={props.align === 'right' ? styles.messageContent : styles.messageAltContent}>
          {props.message}
        </Text>
      </Badge>
    </Body>
  </CardItem>
));

export const InboxMessage = observer((props) => (
  <ListItem 
    thumbnail 
    style={props.status === 'unread' ? styles.unreadItem : styles.item} 
    onPress={() => {
      NavigationService.push('Conversation', { 
        chatmateId: props.chatmateId, 
        chatmateName: props.chatmateName,
        chatmateRole: props.chatmateRole 
      });
      RootStore.inboxStore.markAsRead(props.loggedId, props.chatmateId)
    }}
  >
    <Left>
      <Thumbnail 
        circle 
        source={props.chatmateRole === 'barangay_member' ? MemberAvatar : BrgyAvatar} 
        style={styles.itemAvatar}
      />
    </Left>
    <Body style={styles.itemBody}>
      <Text style={props.status === 'unread' ? styles.unreadItemTitle : styles.itemTitle} numberOfLines={1}>
        {props.chatmateName}
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


export const StatusIndicator = observer((props) => (
  <View style={props.connected ? styles.statusConnected : styles.statusConnecting}>
    <Text style={styles.statusText}>
      {props.connected
        ? 'Connected'
        : 'Waiting to reconnect...'
      }
    </Text>
  </View>
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
    minHeight: 76,        
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
  statusConnecting: {
    position: 'relative',
    backgroundColor: '#ffab12',
    padding: 5,
    width: Dimensions.get('window').width,
    zIndex: 10        
  },
  statusConnected: {
    position: 'relative',    
    backgroundColor: '#28c128',
    padding: 5,
    width: Dimensions.get('window').width,
    zIndex: 10    
  },
  statusText: {
    color: 'white',
    fontFamily: fonts.LATO_BOLD,
    fontSize: 15,
    fontWeight: 'normal',
    textAlign: 'center'
  },
  messageContainer: {
    paddingTop: 5,
    paddingBottom: 0,
  },
  messageAltBubble: {
    alignSelf: 'flex-start',
    height: null,
    backgroundColor: '#dbe5eb',
    borderRadius: 20,
    maxWidth: (Dimensions.get('window').width - 34) * 0.80,
    paddingLeft: 13,
    paddingRight: 13,
    paddingTop: 10,
    paddingBottom: 10,
    zIndex: 10
  },
  messageAltContent: {
    color: colors.DARK,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 15.5,
    flexWrap: 'wrap',
    lineHeight: 22,
    paddingLeft: 0,
    paddingRight: 0,
    textAlign: 'left'
  },
  messageBubble: {
    alignSelf: 'flex-end',
    height: null,
    backgroundColor: colors.PRIMARY,
    borderRadius: 20,
    maxWidth: (Dimensions.get('window').width - 34) * 0.80,
    paddingLeft: 13,
    paddingRight: 13,
    paddingTop: 10,
    paddingBottom: 10,
    zIndex: 10    
  },
  messageContent: {
    color: colors.LIGHT,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 15.5,
    flexWrap: 'wrap',
    lineHeight: 22,
    paddingLeft: 0,
    paddingRight: 0,
    textAlign: 'left'
  },
});