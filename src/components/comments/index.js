import React from 'react';
import { observer } from 'mobx-react';
import { Dimensions, StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Badge, CardItem, Body, Text, Thumbnail } from 'native-base';
import BrgyAvatar from '../../../assets/images/default-brgy.png';
import MemberAvatar from '../../../assets/images/default-member.png';
import NavigationService from 'services/NavigationService';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

export const Comment = observer((props) => (
  <CardItem style={styles.comment}>
    <Body style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={props.handleViewPage}>
        <Thumbnail 
          circle 
          source={props.authorRole === 'barangay_page_admin' ? BrgyAvatar : MemberAvatar}
          style={styles.commentAvatar} 
        />
      </TouchableOpacity>
      <View>
        <Badge style={styles.commentBubble}>
          <Text style={styles.commentAuthor}>{props.authorName}</Text>
          <Text style={styles.commentMessage}>{props.message}</Text>
        </Badge>
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.commentDetails}>{props.dateCreated}</Text>
            {((props.authorId === props.loggedUserId && props.authorRole ==='barangay_member') 
            || (props.authorBrgyId === props.loggedUserBrgyId && props.loggedUserRole === 'barangay_page_admin')) && (
              <React.Fragment>
                <Text style={styles.commentDetails}> &middot; </Text>   
                <TouchableOpacity onPress={props.handleDelete}>
                  <Text style={styles.commentButton}>Delete</Text>      
                </TouchableOpacity>  
              </React.Fragment>
            )} 
        </View>
      </View>
    </Body>
  </CardItem>
));

const styles = StyleSheet.create({
  comment: {
    paddingTop: 10,
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 10
  },
  commentAvatar: {
    borderColor: colors.PRIMARY,
    borderWidth: 2,
    width: 40,
    height: 40,
    marginTop: 10,
    marginRight: 10
  },
  commentBubble: {
    flexDirection: 'column', 
    height: null,
    backgroundColor: '#dbe5eb',
    borderRadius: 10,
    maxWidth: Dimensions.get('window').width - 28 - 50,
    marginBottom: 5
  },
  commentAuthor: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_HEAVY,
    fontSize: 14.5,
    paddingTop: 7,    
    paddingLeft: 7.5,
    paddingRight: 7.5,
    textAlign: 'left'
  },
  commentMessage: {
    color: colors.DARK,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 14.5,
    flexWrap: 'wrap',
    paddingLeft: 7.5,
    paddingRight: 7.5,
    paddingBottom: 7,
    textAlign: 'left', 
  },
  commentDetails: {
    color: 'gray',
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 14,
  },
  commentButton: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 14    
  }
});

