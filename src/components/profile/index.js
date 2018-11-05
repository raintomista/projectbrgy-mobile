import React from 'react';
import numeral from 'numeral';
import { observer } from 'mobx-react';
import {
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import {
  Button,
  Body,
  Card,
  CardItem,
  Col,
  Grid,
  Left,
  ListItem,
  Right,
  Tab,
  TabHeading,
  Tabs,
  Text,
  Thumbnail
} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MemberAvatar from '../../../assets/images/default-member.png';
import NavigationService from 'services/NavigationService';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

export const ProfileCard = observer((props) => (
  <View style={{flex: 1, minHeight: 500}}>
    <LinearGradient 
      colors={[colors.PRIMARY, colors.SECONDARY]} 
      style={styles.profileHeader}
    />
    <Thumbnail 
      circle 
      source={MemberAvatar} 
      style={styles.profileAvatar}
    />
    <Card style={styles.profileCard}> 
      <CardItem>
        <Body>
          <Text 
            style={styles.profileName}
            numberOfLines={3}>
              {props.name}
          </Text>
          <Text style={styles.profileLocation}>
            {props.municipality}
          </Text>
          <MessageButton label="Message" />   
          <StatCount
            label="Following"
            value={props.followingCount}
            navigationKey="BarangayFollowing"
            id={props.id}
          />
          <SeeMoreButton
            region={props.region}
            municipality={props.municipality}
            province={props.province}
            barangay={props.barangay}
            barangayCaptain={props.barangayCaptain}
            barangayAddress={props.barangayAddress}
            email={props.email}
            landline={props.landline}
            mobile={props.mobile}
          /> 
        </Body>
      </CardItem>
    </Card>
  </View>
));

export const MessageButton = observer((props) => (
  <Button style={styles.profileButton} rounded>
    <Text 
      uppercase={false}  
      style={styles.profileButtonText}
    >
      Message
    </Text>
  </Button>
));

export const StatCount = observer((props) => (
  <TouchableOpacity 
    style={styles.profileStatButton}
    onPress={() => {
      NavigationService.push(props.navigationKey, {brgyId: props.id});
    }}
  >
    <Text uppercase={true}>
      <Text style={styles.profileStatCount} uppercase={true}>
          { props.value < 10000
            ? props.value
            : numeral(props.value).format('0.0a')
          }
      </Text>   
      <Text style={styles.profileStatLabel} uppercase={true}>
          &nbsp;{props.label}
      </Text>
    </Text>
  </TouchableOpacity>
));

export const SeeMoreButton = observer((props) => (
  <TouchableOpacity 
    style={{alignSelf: 'center'}}
    onPress={() => {
      NavigationService.push('ProfileInformation', props);
    }}
  >
    <Text style={styles.profileSeeMore}>
      <FontAwesome5 
        name="chevron-circle-down" 
        color={colors.PRIMARY} 
        size={13} 
        solid 
      />
      &nbsp;More Details
    </Text>    
  </TouchableOpacity>    
));

export const ProfileInformationCard = observer((props) => (
  <Card style={styles.profileDetailCard}>
    <CardItem>
      <Body>
        <Text style={styles.profileDetailCardTitle}>Barangay Information</Text>
        <Text style={styles.profileDetails}>Region: {props.region}</Text>
        <Text style={styles.profileDetails}>Province: {props.province}</Text>
        <Text style={styles.profileDetails}>City/Municipality: {props.municipality}</Text>
        <Text style={styles.profileDetails}>Barangay: {props.barangay}</Text>
        <Text style={styles.profileDetails}>Barangay Captain: {props.barangayCaptain}</Text>
        <Text style={styles.profileDetails}>Barangay Office Address: {props.barangayAddress}</Text>
      </Body>
    </CardItem>
  </Card>
));

export const ContactInformationCard = observer((props) => (
  <Card style={styles.profileDetailCard}>
    <CardItem>
      <Body>
        <Text style={styles.profileDetailCardTitle}>
          Contact Information
        </Text>
        {props.email && (
          <ListItem style={styles.profileDetailListItem} icon>
            <Left style={styles.profileDetailIcon}>
              <FontAwesome5 
                name="envelope" 
                color={colors.PRIMARY} 
                style={{alignSelf: 'center'}}                      
                size={15} 
                solid 
              />
            </Left>
            <Right style={{borderBottomWidth: 0}}>
              <Text style={styles.profileDetail}>
                {props.email}
              </Text>
            </Right>
          </ListItem>
        )}
        {props.mobile && (
          <ListItem style={styles.profileDetailListItem} icon>
            <Left style={styles.profileDetailIcon}>
              <FontAwesome5 
                name="mobile-alt" 
                color={colors.PRIMARY} 
                style={{alignSelf: 'center'}}
                size={15} 
                solid 
              />
            </Left>
            <Right style={{borderBottomWidth: 0}}>
              <Text style={styles.profileDetail}>
                {props.mobile}
              </Text>
            </Right>
          </ListItem>
        )}
        {props.landline && (
          <ListItem style={styles.profileDetailListItem} icon>
            <Left style={styles.profileDetailIcon}>
              <FontAwesome5 
                name="phone" 
                color={colors.PRIMARY} 
                style={{alignSelf: 'center'}}                      
                size={15} 
                solid 
              />
            </Left>
            <Right style={{borderBottomWidth: 0}}>
              <Text style={styles.profileDetail}>
                {props.landline}
              </Text>
            </Right>
          </ListItem>
        )}
      </Body>
    </CardItem>
  </Card>
));

const styles = StyleSheet.create({
  profileHeader: {
    position: 'absolute',
    height: 150,
    width: Dimensions.get('window').width, 
  },
  profileAvatar: {
    position: 'absolute',
    top: 65,
    alignSelf: 'center',
    borderColor: colors.PRIMARY,
    borderRadius: 100,
    borderWidth: 2,
    height: 160,
    width: 160,
    zIndex: 5,
  },
  profileCard: {
    position: 'absolute',
    top: 150,
    borderColor: colors.TRANSPARENT,
    borderWidth: 0,
    borderRadius: 0,
    elevation: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    paddingTop: 65,
    paddingBottom: 15,
    width: Dimensions.get('window').width, 
  },
  profileName: {
    alignSelf: 'center',
    color: colors.PRIMARY,
    fontFamily: fonts.MONTSERRAT_BOLD,
    fontSize: 30,
    textAlign: 'center'
  },
  profileLocation: {
    alignSelf: 'center',
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 25,
    marginBottom: 20,
    textAlign: 'center'    
  },
  profileButton: {
    alignSelf: 'center',
    backgroundColor: colors.TRANSPARENT,
    borderColor: colors.PRIMARY,
    borderWidth: 2,
    elevation: 0,
    marginBottom: 25,
    marginHorizontal: 8, 
    paddingHorizontal: 20    
  },
  profileButtonText: {
    alignSelf: 'center',
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_BOLD,
    fontSize: 16,
  },
  profileStatButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    paddingRight: 0
  },
  profileStatCount: {
    color: colors.PRIMARY,
    fontFamily: fonts.MONTSERRAT_BOLD,
    fontSize: 15,
  },
  profileStatLabel: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 15,
    textAlign: 'center'
  },
  profileSeeMore: {
    alignSelf: 'center',
    color: colors.PRIMARY,    
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 15,
    paddingTop: 25,
    textAlign: 'center'    
  },
  profileDetailCard: {
    borderRadius: 0,
    elevation: 0,
    marginTop: 12,
    marginBottom: 0,
    marginLeft: 12,
    marginRight: 12
  },
  profileDetailCardTitle: {
    color: colors.PRIMARY,
    fontFamily: fonts.MONTSERRAT_BOLD,
    fontSize: 20,
    marginBottom: 10
  },
  profileDetails: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 17,
    marginLeft: 10,
    marginBottom: 5
  },
  profileDetailListItem: {
    height: 35,
    marginLeft: 10
  },
  profileDetailIcon: {
    width: 35
  },
  profileDetail: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 17,
    height: 35,
  }
});