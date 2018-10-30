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
              Barangay 1
          </Text>
          <Text style={styles.brgyPageLocation}>
            Caloocan City
          </Text>  
          <BarangayDetails />
          <Grid>
            <Col>
              <StatCount
                label="Following"
                value="100314310"
              />
            </Col>
            <Col>
              <StatCount
                label="Followers"
                value="454445121"
              />
            </Col>
          </Grid>
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
          brgy1@b2p.com
        </Text>
      </Right>
    </ListItem>
    <ListItem style={styles.brgyDetailListItem} icon>
      <Left style={styles.brgyDetailIcon}>
        <FontAwesome5 
          name="mobile-alt" 
          color={colors.PRIMARY} 
          style={{alignSelf: 'center'}}                      
          size={15} 
          solid 
        />
      </Left>
      <Right style={{borderBottomWidth: 0}}>
        <Text style={styles.brgyDetail}>
          (0995) 978 6692
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
          n/a
        </Text>
      </Right>
    </ListItem>
  </React.Fragment>
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
    marginBottom: 10,
    textAlign: 'center'    
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
  brgyPageStatBtn: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 15,
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