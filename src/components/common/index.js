import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Image from 'react-native-scalable-image';
import { observer } from 'mobx-react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { DrawerActions, StackActions } from "react-navigation";
import { 
  Header,
  Card,
  CardItem,
  Container, 
  Left, 
  Right,
  Body,
  Title, 
  Content,
  Icon,  
  Button, 
  Text,
  Thumbnail,  
} from 'native-base';
import BrgyAvatar from '../../../assets/images/default-brgy.png';
import NavigationService from 'services/NavigationService';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

export const HeaderWithDrawer = (props) => (
  <Header style={styles.header}>
    <Left>
      <Button
        transparent
        onPress={() => NavigationService.dispatch(DrawerActions.openDrawer())}
      >
        <Icon name="menu" />
      </Button>
    </Left> 
    <Body>
      <Title style={styles.headerTitle}>
        {props.title}
      </Title>
    </Body>
    <Right />
  </Header>
);

export const HeaderWithGoBack = observer((props) => (
  <Header style={styles.header}>
    <Left>
      <Button
        transparent
        onPress={() => NavigationService.dispatch(StackActions.pop())}
      >
        <Icon name="arrow-back" />
      </Button>
    </Left> 
    <Body>
      <Title style={styles.headerTitle}>
        {props.title}
      </Title>
    </Body>
    <Right />
  </Header>
));


export const AnnouncementCard = observer((props) => (
  <Card style={styles.card}>
    <CardItem style={{paddingTop: 18}}>
      <Left style={{minWidth: 200}}>
        <TouchableOpacity>
          <Thumbnail 
            circle 
            source={BrgyAvatar}
            style={styles.cardAvatar} 
          />
        </TouchableOpacity>
        <Body>
          <TouchableOpacity>
            <Text style={styles.cardAuthor} numberOfLines={1}>Barangay 1</Text>
          </TouchableOpacity>
          <Text note style={styles.cardDetails} numberOfLines={1}>Oct 20, 2019 &middot; Lagunadadadada </Text>
        </Body>
      </Left>
      <Right>
        <TouchableOpacity style={styles.cardOptions}>
          <FontAwesome5   
            name="chevron-down" 
            color={colors.PRIMARY} 
            size={18} 
            solid 
          />
        </TouchableOpacity>
      </Right>
    </CardItem>
    <CardItem style={{paddingTop: 0, paddingBottom: 15}}>
      <Text style={styles.cardMessage}>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500
      </Text>
    </CardItem>
    {/* <CardItem cardBody>
      <Image 
        source={BrgyAvatar} 
        width={Dimensions.get('window').width - 20}
      />
    </CardItem> */}
    {/* <CardItem style={styles.cardFileAttachment}>
      <Body>
        <TouchableOpacity>
          <Text style={styles.fileAttachmentName} uppercase={false} numberOfLines={1}>
            sample-filenamedadada-dada.png
          </Text>
          <Text style={styles.fileAttachmentDetails} uppercase={false} numberOfLines={1} note>
            dropbox.com
          </Text>  
        </TouchableOpacity>
      </Body> 
      <Right>
        <TouchableOpacity>
          <FontAwesome5   
            name="cloud-download-alt" 
            color="gray" 
            size={18} 
            solid 
          />
        </TouchableOpacity>
      </Right>
    </CardItem> */}
    <CardItem style={styles.cardActionButtons}>
      <CardActionButton label="Liked" active/>
      <CardActionButton label="Comment"/>
      <CardActionButton label="Share"/>      
    </CardItem>
  </Card>
));

const CardActionButton = observer((props) => (
  <TouchableOpacity style={styles.cardActionButton} transparent>
    <Text 
      style={!props.active ? styles.cardActionButtonText : styles.cardActiveActionButtonText} 
      uppercase={false}
    >
      {props.label}
    </Text>
  </TouchableOpacity>
))

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.PRIMARY
  },
  headerTitle: {
    fontFamily: fonts.MONTSERRAT_BOLD
  },
  card: {
    borderRadius: 0,
    elevation: 0,
  },
  cardAvatar: {
    borderColor: colors.PRIMARY,
    borderWidth: 2,
    width: 50,
    height: 50,
  },
  cardAuthor: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_BOLD,
    fontSize: 18,
  },
  cardDetails: {
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 15
  },
  cardOptions: {
    paddingRight: 5,
    paddingBottom: 10
  },
  cardMessage: {
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 16
  },
  cardFileAttachment: {
    borderColor: 'rgba(0, 0, 0, 0.125)',
    borderWidth: 0.5,
    elevation: 2.5,
    marginTop: -3,
    marginHorizontal: 15,
    marginBottom: 22
  },
  cardImageAttachment: {
    width: '100%'
  },
  cardActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopColor: 'rgba(0, 0, 0, 0.125)',
    borderTopWidth: 0.5,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 0,
    paddingRight: 0,    
  },
  cardActionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    minWidth: 75,
    paddingVertical: 6
  },
  cardActionButtonText: {
    color: 'gray',
    fontFamily: fonts.LATO_HEAVY,
    fontSize: 16.5,
    paddingLeft: 0,
    paddingRight: 0,
  },
  cardActiveActionButtonText: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_HEAVY,
    fontSize: 16.5,
    paddingLeft: 0,
    paddingRight: 0,
  },
  fileAttachmentName: {
    fontFamily: fonts.LATO_BOLD,
    fontSize: 16.5,
    minWidth: 200
  },
  fileAttachmentDetails: {
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 16,
    marginTop: -4,
    minWidth: 200    
  }
});
