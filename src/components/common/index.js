import React from 'react';
import { StatusBar, Dimensions, Modal, StyleSheet, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import Image from 'react-native-image-progress';
// import ProgressBar from 'react-native-progress/Bar';
import { observer } from 'mobx-react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { DrawerActions, StackActions } from "react-navigation";
import { 
  Badge,
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
import MemberAvatar from '../../../assets/images/default-member.png';
import NavigationService from 'services/NavigationService';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

export const HeaderWithDrawer = (props) => (
  <Header style={styles.header}>
    <StatusBar backgroundColor={colors.PRIMARY} barStyle="light-content"/>  
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
    <StatusBar backgroundColor={colors.PRIMARY} barStyle="light-content"/>
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

export const TransparentHeaderWithGoBack = observer((props) => (
  <Header style={{backgroundColor: 'transparent', elevation: 0 }}>
    <Left>
      <Button
        transparent
        onPress={() => NavigationService.dispatch(StackActions.pop())}
      >
        <Icon name="arrow-back" />
      </Button>
    </Left> 
    <Body>
    </Body>
    <Right />
  </Header>
));


export const EmptyState = observer((props) => (
  <View style={styles.emptyStateView}>
    {props.title && (
      <Text style={styles.emptyStateTitle}>{props.title}</Text>
    )}
    {props.detail && (
      <Text style={styles.emptyStateDetail}>{props.detail}</Text> 
    )}
  </View>
));

export const EmptyStateAlt = observer((props) => (
  <View style={styles.emptyStateViewAlt}>
    {props.title && (
      <Text style={styles.emptyStateTitle}>{props.title}</Text>
    )}
    {props.detail && (
      <Text style={styles.emptyStateDetail}>{props.detail}</Text> 
    )}
  </View>
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
  <Card style={[styles.card, props.index == 0 ? {marginTop: 8} : null]}>
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
    <CardItem style={{paddingTop: 0, paddingBottom: 0}}>
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

    {(props.likeCount != '0' || props.commentCount != '0' || props.shareCount != '0')  && (
      <CardItem style={styles.cardStats}>
        <View style={styles.cardLikeStat}>
          {props.likeCount != '0' && (
            <React.Fragment>
              <Badge style={styles.cardLikeCircleIcon}>
                <FontAwesome5   
                  name="thumbs-up" 
                  color="white" 
                  size={9} 
                  solid 
                  style={{alignSelf: 'center'}}
                />
              </Badge> 
              <Text style={styles.cardLikeStatText}>
                {props.likeCount}
              </Text>
            </React.Fragment>
          )}        
        </View>
        <View style={{flexDirection: 'row'}}>
          {props.commentCount != '0' && (
            <TouchableOpacity onPress={props.handleViewComments}>
              <Text style={styles.cardStatText}>
                {props.commentCount > 1 
                  ? `${props.commentCount} Comments`
                  : `${props.commentCount} Comment`
                }
              </Text>
            </TouchableOpacity>
          )}

          {props.shareCount != '0' && (
            <Text style={styles.cardStatText}>
                {props.shareCount > 1 
                  ? `${props.shareCount} Shares`
                  : `${props.shareCount} Share`
                }
            </Text>
          )}
        </View>
      </CardItem>
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

export const SharedPostCard = observer((props) => (
  <Card style={[styles.card, props.index == 0 ? {marginTop: 8} : null]}>
    <CardItem style={{paddingTop: 18}}>
      <Left style={{minWidth: 200}}>
        <TouchableWithoutFeedback onPress={props.handleViewAuthor} style={{alignSelf: 'flex-start'}}>
          <Thumbnail 
            circle 
            source={props.authorRole === 'barangay_member' ? MemberAvatar : BrgyAvatar}
            style={styles.cardAvatar} 
          />
        </TouchableWithoutFeedback>
        <Body>
          <Text>
            <Text style={styles.cardAuthor} onPress={props.handleViewAuthor}>
              {props.author}
            </Text>
            <Text style={styles.cardShareActivity}>
              &nbsp;shared a post.
            </Text>
          </Text>
          <Text note style={styles.cardDetails} numberOfLines={1}>
            {props.dateCreated} &middot; {props.location}
          </Text>
        </Body>
      </Left>
      <Right>
        <TouchableWithoutFeedback onPress={props.handleOptions}>
          <FontAwesome5   
            name="chevron-down" 
            color={colors.PRIMARY} 
            size={18} 
            style={styles.cardOptions} 
            solid 
          />
        </TouchableWithoutFeedback>
      </Right>
    </CardItem>
    <CardItem style={{paddingTop: 0, paddingBottom: 0}}>
      <Text style={styles.cardMessage}>
        {props.message}
      </Text>
    </CardItem>

    {/* Shared Content */}
    <View style={styles.cardSharedContent}>
      <CardItem style={{paddingTop: 15, paddingBottom: 10, paddingLeft: 15, paddingRight: 15}}>
        <Left style={{minWidth: 200}}>
          <TouchableWithoutFeedback 
            onPress={props.handleViewContentAuthor}
          >
            <Thumbnail 
              circle 
              source={BrgyAvatar}
              style={styles.cardSharedContentAvatar} 
            />
          </TouchableWithoutFeedback>
          <Body>
            <TouchableWithoutFeedback 
              onPress={props.handleViewContentAuthor}
            >
              <Text style={styles.cardSharedContentAuthor}>
                {props.contentAuthor}
              </Text>
            </TouchableWithoutFeedback>
            <Text note style={styles.cardSharedContentDetails} numberOfLines={1}>
              {props.contentDateCreated} &middot; {props.location}, Philippines, NCR
            </Text>
          </Body>
        </Left>
      </CardItem>
      <CardItem style={{ paddingTop: 0,  paddingBottom: 15, paddingLeft: 15, paddingRight: 15 }}>
        <Text style={styles.cardSharedContentMessage}>
          {props.contentMessage}
        </Text>
      </CardItem>

      {props.attachment && props.attachment.preview_type === 'photo' && (
        <CardItem cardBody style={{marginTop: -2}}>
          <TouchableHighlight onPress={props.handleViewImage}>
            <Image 
              source={{uri: props.attachment.link.replace('?dl=0', '?dl=1')}} 
              indicator={ImageLoader}      
              resizeMode='cover'
              style={styles.cardSharedContentImage}
            />
          </TouchableHighlight>
        </CardItem>
      )}

      {props.attachment && props.attachment.preview_type !== 'photo' && (
        <CardItem style={styles.cardSharedContentFileAttachment}>
          <Body>
            <TouchableWithoutFeedback onPress={props.handleOpenLink}>
              <React.Fragment>
                <Text style={styles.cardSharedContentAttachmentFilename} uppercase={false} numberOfLines={1}>
                  {props.attachment.filename}
                </Text>
                <Text style={styles.cardSharedContentAttachmentDetails} uppercase={false} numberOfLines={1} note>
                  {'dropbox.com'}
                </Text>  
              </React.Fragment>
            </TouchableWithoutFeedback>
          </Body> 
          <Right>
            <TouchableWithoutFeedback onPress={props.handleOpenDownloadLink}>
              <FontAwesome5   
                name="cloud-download-alt" 
                color="gray" 
                size={18} 
                solid 
              />
            </TouchableWithoutFeedback>
          </Right>
        </CardItem>
      )}
    </View>
    <CardItem style={styles.cardActionButtons}>
      <DisabledCardActionButton 
        label="Like"
      />
      <DisabledCardActionButton 
        label="Comment"
      />
      <DisabledCardActionButton 
        label="Share"
      />
    </CardItem>
  </Card>
));

const ImageLoader = (props) => (
  <Spinner color={colors.PRIMARY} />
)

const CardImageAttachment = observer((props) => (
  <CardItem cardBody style={{marginTop: 8}}>
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
));

const DisabledCardActionButton = observer((props) => (
  <View style={styles.cardActionButton}>
    <Text 
      style={styles.disabledActionButtonText} 
      uppercase={false}
    >
      {props.label}
    </Text>
  </View>
));



const styles = StyleSheet.create({
  emptyStateView: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height - 56, 
    paddingHorizontal: 20
  },
  emptyStateViewAlt: {
    padding: 20,
  },
  emptyStateTitle: {
    color: colors.PRIMARY,
    fontFamily: fonts.MONTSERRAT_BOLD,
    fontSize: 25,
    textAlign: 'center'
  },
  emptyStateDetail: {
    color: 'gray',
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 18,
    textAlign: 'center'
  },
  emptyStateDetailAlt: {
    color: 'gray',
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 18,
    textAlign: 'center'
  },
  header: {
    backgroundColor: colors.PRIMARY
  },
  headerTitle: {
    fontFamily: fonts.MONTSERRAT_BOLD
  },
  card: {
    borderRadius: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    elevation: 0,
    marginTop: 0,
    marginBottom: 8,
    marginLeft: 0,
    marginRight: 0
  },
  cardAvatar: {
    alignSelf: 'flex-start',
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
  cardShareActivity: {
    color: 'gray',
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 17.5,
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
    marginTop: 8,
    marginHorizontal: 15,
  },
  cardImageAttachment: {
    backgroundColor: colors.GRAY,
    width: Dimensions.get('window').width, 
    minHeight: 250
  },
  cardStats: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 0
  },
  cardLikeStat: {
    flexDirection: 'row'
  },
  cardLikeCircleIcon: {
    backgroundColor: colors.PRIMARY, 
    height: null, 
    marginRight: 5, 
    paddingTop: 5.5, 
    paddingBottom: 6.5
  },
  cardLikeStatText: {
    color: 'gray',
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 15
  },
  cardStatText: {
    color: 'gray',
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 15,    
    marginLeft: 10
  },
  cardActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopColor: 'rgba(0, 0, 0, 0.125)',
    borderTopWidth: 0.5,
    marginTop: 10,
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
  disabledActionButtonText: {
    color: colors.DARK_GRAY,
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
  },
  cardSharedContent: {
    flexDirection: 'column',
    borderColor: 'rgba(0, 0, 0, 0.125)',
    borderRadius: 0,
    borderWidth: 1,
    marginTop: 12,
    marginBottom: 5,
    marginHorizontal: 17,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
  },
  cardSharedContentAvatar: {
    alignItems: 'flex-start',
    borderColor: colors.PRIMARY,
    borderWidth: 1.5,
    width: 40,
    height: 40,
  },
  cardSharedContentAuthor: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_BOLD,
    fontSize: 16,
  },
  cardSharedContentDetails: {
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 14.5
  },
  cardSharedContentMessage: {
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 15
  },
  cardSharedContentImage: {
    backgroundColor: colors.GRAY,
    width: Dimensions.get('window').width - 34, 
    minHeight: 250
  },
  cardSharedContentFileAttachment: {
    borderColor: 'rgba(0, 0, 0, 0.125)',
    borderWidth: 0.5,
    elevation: 2.5,
    marginHorizontal: 15,
    marginBottom: 18,
  },
  cardSharedContentAttachmentFilename: {
    fontFamily: fonts.LATO_BOLD,
    fontSize: 14.5,
    maxWidth: 180
  },
  cardSharedContentAttachmentDetails: {
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 14,
    minWidth: 180    
  },
});
