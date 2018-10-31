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
import BrgyAvatar from '../../../assets/images/default-brgy.png';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

export const BarangayPageCard = observer((props) => (
  <View style={{flex: 1, minHeight: 500}}>
    <LinearGradient 
      colors={[colors.PRIMARY, colors.SECONDARY]} 
      style={styles.brgyPageHeader}
    />
    <Thumbnail 
      circle 
      source={BrgyAvatar} 
      style={styles.brgyPageAvatar}
    />
    <Card style={styles.brgyPageCard}> 
      <CardItem>
        <Body>
          <Text 
            style={styles.brgyPageName}
            numberOfLines={3}>
              {props.name}
          </Text>
          <Text style={styles.brgyPageLocation}>
            {props.municipality}
          </Text>
          <View style={styles.brgyPageButtons}>
            {props.isFollowing
              ? <RoundedButton label="Following" solid />
              : <RoundedButton label="Follow" />
            }
            
            <RoundedButton label="Message" />            
          </View>
          <Grid>
            <Col>
              <StatCount
                label="Following"
                value={props.followingCount}
              />
            </Col>
            <Col>
              <StatCount
                label="Followers"
                value={props.followersCount}
              />
            </Col>
          </Grid>
          <SeeMoreButton />
        </Body>
      </CardItem>
    </Card>
  </View>
));

export const BarangayDetails = observer((props) => (
  <React.Fragment>
    <ListItem style={styles.brgyDetailListItem} icon>
      <Left style={styles.brgyDetailIcon}>
        <FontAwesome5 
          name="envelope" 
          color={colors.PRIMARY} 
          style={{alignSelf: 'center'}}                      
          size={15} 
          solid 
        />
      </Left>
      <Right style={{borderBottomWidth: 0}}>
        <Text style={styles.brgyDetail}>
          {props.email ? props.email : 'n/a'}
        </Text>
      </Right>
    </ListItem>
    <ListItem style={styles.brgyDetailListItem} icon>
      <Left style={styles.brgyDetailIcon}>
        <FontAwesome5 
          name="phone" 
          color={colors.PRIMARY} 
          style={{alignSelf: 'center'}}                      
          size={15} 
          solid 
        />
      </Left>
      <Right style={{borderBottomWidth: 0}}>
        <Text style={styles.brgyDetail}>
          {props.landline ? props.landline : 'n/a'}
        </Text>
      </Right>
    </ListItem>
    <ListItem style={styles.brgyDetailListItem} icon>
      <Left style={styles.brgyDetailIcon}>
        <FontAwesome5 
          name="globe" 
          color={colors.PRIMARY} 
          style={{alignSelf: 'center'}}                      
          size={15} 
          solid 
        />
      </Left>
      <Right style={{borderBottomWidth: 0}}>
        <Text style={styles.brgyDetail}>
          {props.website ? props.website : 'n/a'}
        </Text>
      </Right>
    </ListItem>
  </React.Fragment>
));

export const SeeMoreButton = observer((props) => (
  <TouchableOpacity 
    style={{alignSelf: 'center'}}
    onPress={() => {
      NavigationService.push('ProfileInformation', {});
    }}
  >
    <Text style={styles.brgyPageSeeMore}>
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

export const RoundedButton = observer((props) => (
  <Button
    rounded   
    style={
      props.solid 
        ? styles.brgyPageActiveButton 
        : styles.brgyPageButton
    }
  >
  <Text 
    uppercase={false}  
    style={
      props.solid
        ? styles.brgyPageActiveButtonText
        : styles.brgyPageButtonText
    }
  >
    {props.label}
  </Text>
</Button>
));

export const StatCount = observer((props) => (
  <TouchableOpacity style={styles.brgyPageStatBtn}>
    <Text uppercase={true}>
      <Text style={styles.brgyPageStatCount} uppercase={true}>
          { props.value < 10000
            ? props.value
            : numeral(props.value).format('0.0a')
          }
      </Text>   
      <Text style={styles.brgyPageStatLabel} uppercase={true}>
          &nbsp;{props.label}
      </Text>
    </Text>
  </TouchableOpacity>
));

export const FeedTabs = observer((props) => (
  <Tabs 
    style={styles.brgyPageTabs}
    tabBarUnderlineStyle={styles.brgyPageTabLine}
  >
    <Tab 
      heading="Posts"
      tabStyle={styles.brgyPageTab}
      textStyle={styles.brgyPageTabText}
      activeTabStyle={styles.brgyPageTab}
      activeTextStyle={styles.brgyPageTabText}
    >

    </Tab>
    <Tab 
      heading="Shared Posts"
      tabStyle={styles.brgyPageTab}    
      textStyle={styles.brgyPageTabText}   
      activeTabStyle={styles.brgyPageTab}
      activeTextStyle={styles.brgyPageTabText}        
    >
    </Tab>
  </Tabs>
));


const styles = StyleSheet.create({
  brgyPageHeader: {
    position: 'absolute',
    height: 150,
    width: Dimensions.get('window').width, 
  },
  brgyPageAvatar: {
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
  brgyPageCard: {
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
  brgyPageName: {
    alignSelf: 'center',
    color: colors.PRIMARY,
    fontFamily: fonts.MONTSERRAT_BOLD,
    fontSize: 30,
    textAlign: 'center'
  },
  brgyPageLocation: {
    alignSelf: 'center',
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 25,
    marginBottom: 20,
    textAlign: 'center'    
  },
  brgyPageButtons: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 25,
    width: Dimensions.get('window').width - 34
  },
  brgyPageActiveButton: {
    flex: 1,
    flexGrow: 1,    
    backgroundColor: colors.PRIMARY,
    borderColor: colors.PRIMARY,
    elevation: 0,
    marginHorizontal: 8,
    paddingHorizontal: 2,
    paddingVertical: 8 
  },
  brgyPageActiveButtonText: {
    alignSelf: 'center',
    color: colors.LIGHT,
    fontFamily: fonts.LATO_BOLD,
    fontSize: 16,
  },
  brgyPageButton: {
    flex: 1,
    flexGrow: 1,    
    backgroundColor: colors.TRANSPARENT,
    borderColor: colors.PRIMARY,
    borderWidth: 2,
    elevation: 0,
    marginHorizontal: 8, 
  },
  brgyPageButtonText: {
    alignSelf: 'center',
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_BOLD,
    fontSize: 16,
  },
  brgyDetailListItem: {
    height: 35,
    marginLeft: 10
  },
  brgyDetailIcon: {
    width: 35
  },
  brgyDetail: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 16.5,
    height: 35,
  },
  brgyPageSeeMore: {
    alignSelf: 'center',
    color: colors.PRIMARY,    
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 15,
    paddingTop: 25,
    textAlign: 'center'    
  },
  brgyPageStatBtn: {
    alignSelf: 'center',
    justifyContent: 'center',
    paddingRight: 0
  },
  brgyPageStatCount: {
    color: colors.PRIMARY,
    fontFamily: fonts.MONTSERRAT_BOLD,
    fontSize: 15,
  },
  brgyPageStatLabel: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 15,
    textAlign: 'center'
  },
  brgyPageTabs: {
    // position: 'absolute', 
    // top: 500,
    // zIndex: 5
  },
  brgyPageTabLine: {
    backgroundColor: colors.PRIMARY
  },
  brgyPageTab: {
    backgroundColor: colors.LIGHT
  },
  brgyPageTabText: {
    color: colors.PRIMARY,
    fontFamily: fonts.MONTSERRAT_BOLD,
    fontSize: 18,
    fontWeight: 'normal'
  },
});