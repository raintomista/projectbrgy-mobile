import React from 'react';
import { observer } from 'mobx-react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ListItem,  Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import BrgyAvatar from '../../../assets/images/default-brgy.png';
import NavigationService from 'services/NavigationService';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

export const FollowingListItem = observer((props) => (
  <ListItem thumbnail onPress={() => openBarangayPage(props.id)}>
    <Left>
      <Thumbnail 
        circle 
        source={BrgyAvatar} 
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
    <Right style={{borderBottomWidth: 0}}/>
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
  }
});