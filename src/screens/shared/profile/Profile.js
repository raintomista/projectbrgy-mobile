import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { 
  Dimensions,
  FlatList, 
  Image, 
  RefreshControl, 
  StyleSheet, 
  View 
} from 'react-native';
import { 
  Body,
  Card, 
  CardItem, 
  Container, 
  Content, 
  List, 
  Spinner, 
  Text,
  Thumbnail
} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight } from 'react-native-cross-platform-responsive-dimensions'
import MemberAvatar from '../../../../assets/images/default-member.png';
import { HeaderWithDrawer } from 'components/common';
import { FollowingListItem } from 'components/profile-following';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

@observer
export default class Profile extends Component {
  render() {
    return (
      <Content>
        <HeaderWithDrawer 
          title="Profile" 
          navigation={this.props.navigation} 
        />
        <View style={styles.view}>
          <React.Fragment style={{flex: 1}}>
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
                    numberOfLines={3}
                  >
                    Rainier Francis Santos Tomista
                  </Text>
                  <Text style={styles.profileLocation}>Caloocan City</Text>         
                  <Text style={styles.profileSeeMore}>See More</Text>         
                </Body>
              </CardItem>
            </Card>
          </React.Fragment>
        </View>
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    height:Dimensions.get('window').height, 
    backgroundColor: colors.BACKGROUND
  },
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
    textAlign: 'center'    
  },
  profileSeeMore: {
    alignSelf: 'center',
    color: colors.PRIMARY,    
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 18,
    paddingTop: 20,
    paddingBottom: 10,
    textAlign: 'center'    
  }
});