import React from 'react';
import { Dimensions, Modal, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import Image from 'react-native-image-progress';
// import ProgressBar from 'react-native-progress/Bar';
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
  Spinner,
  Button, 
  Text,
  Thumbnail,  
} from 'native-base';
import ImageViewer from 'react-native-image-zoom-viewer';
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

export const LightboxClose = (props) => (
  <TouchableOpacity onPress={props.handleCloseImage} style={styles.imageViewerHeader}>
    <Icon
      ios="ios-close"
      android="md-close"
      style={{ color: 'white'}}
    />
  </TouchableOpacity>
);

export const Lightbox = observer((props) => (
  <Modal 
    onRequestClose={props.handleCloseImage}
    visible={props.visible} 
    transparent={true}
  >
    <ImageViewer 
      imageUrls={props.images}
      saveToLocalByLongPress={false}
      maxOverflow={0}
      renderHeader={() => <LightboxClose handleCloseImage={props.handleCloseImage} />}
      renderIndicator={() => null}
      loadingRender={() => <Spinner color={colors.PRIMARY} />}
    />
  </Modal>
));

export const AnnouncementCard = observer((props) => (
  <Card style={[styles.card, props.index == 0 ? {marginTop: 12} : null]}>
    <CardItem style={{paddingTop: 18}}>
      <Left style={{minWidth: 200}}>
        <TouchableOpacity onPress={props.handleViewPage}>
          <Thumbnail 
            circle 
            source={BrgyAvatar}
            style={styles.cardAvatar} 
          />
        </TouchableOpacity>
        <Body>
          <TouchableOpacity onPress={props.handleViewPage}>
            <Text style={styles.cardAuthor} numberOfLines={1}>
              {props.author}
            </Text>
          </TouchableOpacity>
          <Text note style={styles.cardDetails} numberOfLines={1}>
            {props.dateCreated} &middot; {props.location}
          </Text>
        </Body>
      </Left>
      <Right>
        <TouchableOpacity style={styles.cardOptions} onPress={props.handleOptions}>
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
        {props.message}
      </Text>
    </CardItem>

    {props.attachment && props.attachment.preview_type === 'photo' && (
      <CardImageAttachment 
        imageUri={props.attachment.link.replace('?dl=0', '?dl=1')}
        handleViewImage={props.handleViewImage}
      />
    )}

    {props.attachment && props.attachment.preview_type !== 'photo' && (
      <CardFileAttachment 
        filename={props.attachment.filename}
        details="dropbox.com"
        link={props.attachment.link}
        handleOpenLink={props.handleOpenLink}
        handleOpenDownloadLink={props.handleOpenDownloadLink}
      />
    )}

    <CardItem style={styles.cardActionButtons}>
      <CardActionButton 
        label={props.isLiked === 0 ? 'Like' : 'Liked'}
        active={props.isLiked === 0 ? false : true}
        handlePress={props.handleToggleLike}
      />
      <CardActionButton 
        label="Comment"
        handlePress={props.handleViewComments}
      />
      <CardActionButton 
        label="Share"
        handlePress={props.handleShare}
      />      
    </CardItem>
  </Card>
));

const ImageLoader = (props) => (
  <Spinner color={colors.PRIMARY} />
)

const CardImageAttachment = observer((props) => (
  <CardItem cardBody>
    <TouchableHighlight onPress={props.handleViewImage}>
      <Image 
        source={{uri: props.imageUri}} 
        indicator={ImageLoader}      
        resizeMode='cover'
        style={styles.cardImageAttachment}
      />
    </TouchableHighlight>
  </CardItem>
));

const CardFileAttachment = observer((props) => (
  <CardItem style={styles.cardFileAttachment}>
    <Body>
      <TouchableOpacity onPress={props.handleOpenLink}>
        <Text style={styles.fileAttachmentName} uppercase={false} numberOfLines={1}>
          {props.filename}
        </Text>
        <Text style={styles.fileAttachmentDetails} uppercase={false} numberOfLines={1} note>
          {props.details}
        </Text>  
      </TouchableOpacity>
    </Body> 
    <Right>
      <TouchableOpacity onPress={props.handleOpenDownloadLink}>
        <FontAwesome5   
          name="cloud-download-alt" 
          color="gray" 
          size={18} 
          solid 
        />
      </TouchableOpacity>
    </Right>
  </CardItem>
));

const CardActionButton = observer((props) => (
  <TouchableOpacity 
    onPress={props.handlePress}
    style={styles.cardActionButton} 
    transparent
  >
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
    marginTop: 0,
    marginBottom: 12,
    marginLeft: 12,
    marginRight: 12
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
    backgroundColor: colors.GRAY,
    width: Dimensions.get('window').width - 20, 
    minHeight: 250, 
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
  },
  imageViewerHeader: {
    position: 'absolute', 
    top: 20, 
    left: 20, 
    zIndex: 2
  }
});
