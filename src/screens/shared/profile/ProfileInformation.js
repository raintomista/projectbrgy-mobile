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
  Left,
  List, 
  ListItem,
  Right,
  Spinner, 
  Text,
  Thumbnail
} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight } from 'react-native-cross-platform-responsive-dimensions'
import MemberAvatar from '../../../../assets/images/default-member.png';
import { HeaderWithGoBack } from 'components/common';
import { FollowingListItem } from 'components/profile-following';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

@observer
export default class ProfileInformation extends Component {
  render() {
    return (
      <Container>
        <HeaderWithGoBack 
          title="Details" 
          navigation={this.props.navigation} 
        />
        <View style={styles.view}>
          <Card style={styles.card}>
            <CardItem>
              <Body>
                <Text style={styles.cardTitle}>Barangay Information</Text>
                <Text style={styles.cardDetails}>Region: National Capital Region</Text>
                <Text style={styles.cardDetails}>Province: Metro Manila</Text>
                <Text style={styles.cardDetails}>City/Municipality: Caloocan City</Text>
                <Text style={styles.cardDetails}>Barangay: Barangay 1</Text>
                <Text style={styles.cardDetails}>Barangay Captain: Cornelio B. Borja</Text>
                <Text style={styles.cardDetails}>Barangay Office Address: 6 A.P. Aquino St. Sangg</Text>
              </Body>
            </CardItem>
          </Card>
          <Card style={styles.card}>
            <CardItem>
              <Body>
                <Text style={styles.cardTitle}>Contact Information</Text>
                <ListItem style={styles.cardListItem} icon>
                  <Left style={styles.cardCredentialIcon}>
                    <FontAwesome5 
                      name="envelope" 
                      color={colors.PRIMARY} 
                      style={{alignSelf: 'center'}}                      
                      size={15} 
                      solid 
                    />
                  </Left>
                  <Right style={{borderBottomWidth: 0}}>
                    <Text style={styles.cardCredential}>user1@b2p.com</Text>
                  </Right>
                </ListItem>
                <ListItem style={styles.cardListItem} icon>
                  <Left style={styles.cardCredentialIcon}>
                    <FontAwesome5 
                      name="mobile-alt" 
                      color={colors.PRIMARY} 
                      style={{alignSelf: 'center'}}
                      size={15} 
                      solid 
                    />
                  </Left>
                  <Right style={{borderBottomWidth: 0}}>
                    <Text style={styles.cardCredential}>(0995) 978 6692</Text>
                  </Right>
                </ListItem>
                <ListItem style={styles.cardListItem} icon>
                  <Left style={styles.cardCredentialIcon}>
                    <FontAwesome5 
                      name="phone" 
                      color={colors.PRIMARY} 
                      style={{alignSelf: 'center'}}                      
                      size={15} 
                      solid 
                    />
                  </Left>
                  <Right style={{borderBottomWidth: 0}}>
                    <Text style={styles.cardCredential}>361-4565</Text>
                  </Right>
                </ListItem>
              </Body>
            </CardItem>
          </Card>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: colors.BACKGROUND,
    minHeight: Dimensions.get('window').height - 56,     
  },
  card: {
    borderRadius: 0,
    elevation: 0,
    marginTop: 12,
    marginBottom: 0,
    marginLeft: 12,
    marginRight: 12
  },
  cardTitle: {
    color: colors.PRIMARY,
    fontFamily: fonts.MONTSERRAT_BOLD,
    fontSize: 20,
    marginBottom: 10
  },
  cardDetails: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 17,
    marginLeft: 10,
    marginBottom: 5
  },
  cardListItem: {
    height: 35,
    marginLeft: 10
  },
  cardCredentialIcon: {
    width: 35
  },
  cardCredential: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 17,
    height: 35,
  }
});