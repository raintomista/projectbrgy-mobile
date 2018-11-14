import React from "react";
import { observer } from 'mobx-react';
import {  
  AsyncStorage,  
  ScrollView,
  StatusBar, 
  StyleSheet, 
  TouchableNativeFeedback,
  View 
} from "react-native";
import { StackActions } from 'react-navigation';
import { Container, Content, Text, List, ListItem, Thumbnail} from "native-base";
import MemberAvatar from '../../../assets/images/default-member.png';
import { getUserDetails } from '../../services/AuthService';
import NavigationService from 'services/NavigationService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';


const routes = [
  {key: 'Home', label: 'Home'},
  {key: 'Search', label: 'Search'},
  {key: 'MyBarangay', label: 'My Barangay'},  
  {key: 'Messages', label: 'Messages'},  
  {key: 'MyReportStack', label: 'Reports'}, 
  {key: 'MyRespondedReportStack', label: 'Responded'},    
  {key: 'Login', label: 'Logout'}
];

@observer
export default class MemberSidebar extends React.Component {
  async componentWillMount() {
    await RootStore.sessionStore.getLoggedUser();
  }
  render() {
    const { loggedUser } = RootStore.sessionStore;
    
    return (
      <Container>
        <ScrollView>
          {loggedUser && (
            <TouchableNativeFeedback
              onPress={() => {
                this.handlePress({key: 'MyProfile'})
              }}
            >
              <View style={styles.loggedMemberContainer}>
                <Thumbnail 
                  circle 
                  source={MemberAvatar} 
                  style={styles.loggedMemberAvatar}
                />
                <Text style={styles.loggedMemberName} numberOfLines={1}>
                  {`${loggedUser.user_first_name} ${loggedUser.user_last_name}`}
                </Text>
                <Text style={styles.loggedMemberLocation}>
                  {loggedUser.barangay_page_name},
                </Text>
                <Text style={styles.loggedMemberLocation}>
                  {loggedUser.barangay_page_municipality}
                </Text>
              </View>
            </TouchableNativeFeedback>
          )}
          <List
            dataArray={routes}
            style={{marginVertical: 12}}
            renderRow={(route) => {
              return (
                <ListItem button
                  onPress={() => {
                    this.handlePress(route)
                  }}
                  style={{borderBottomWidth: 0, paddingTop: 12, paddingBottom: 12 }}
                >
                  <Text 
                    style={{
                      color: colors.PRIMARY, 
                      fontFamily: fonts.LATO_MEDIUM, 
                      fontSize: 17.5,
                      fontWeight: 'normal'
                    }}
                  >
                    {route.label}
                  </Text>
                </ListItem>
              );
            }}
          />
        </ScrollView>
      </Container>
    );
  }

  async handlePress(route) {
    switch(route.key) {
      case 'MyBarangay': 
        const brgyId = await AsyncStorage.getItem('brgy-id');
        NavigationService.navigate(route.key, { brgyId });   
        break;
      case 'MyProfile':
        const profileId = await AsyncStorage.getItem('user-id');
        NavigationService.navigate(route.key, { profileId });   
        break;
        case 'Login':
        await AsyncStorage.removeItem('x-access-token');
        await AsyncStorage.removeItem('user-role');
        await AsyncStorage.removeItem('user-id');
        await AsyncStorage.removeItem('brgyId-id');
        NavigationService.navigate(route.key, {});   
        break;
      default:
        NavigationService.dispatch(StackActions.popToTop());
        NavigationService.navigate(route.key);                    
    }
  }
}


const styles = StyleSheet.create({
  loggedMemberContainer: {
    backgroundColor: colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 15
  },
  loggedMemberAvatar: {
    borderRadius: 150,
    height: 150,
    width: 150,
    marginBottom: 10
  },
  loggedMemberName: {
    alignSelf: 'center',
    color: colors.LIGHT,
    fontFamily: fonts.MONTSERRAT_BOLD,
    fontSize: 25,
    textAlign: 'center'
  },
  loggedMemberLocation: {
    alignSelf: 'center',
    color: colors.LIGHT,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 22,
    textAlign: 'center'
  }
});