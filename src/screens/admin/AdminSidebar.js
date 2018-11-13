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
import { Container, Content, Text, List, ListItem, Thumbnail} from "native-base";
import BrgyAvatar from '../../../assets/images/default-brgy.png';
import { getUserDetails } from '../../services/AuthService';
import NavigationService from 'services/NavigationService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';


const routes = [
  {key: 'BarangayHome', label: 'Home'},
  {key: 'Search', label: 'Search'},
  {key: 'MyResidents', label: 'My Residents'},  
  {key: 'Messages', label: 'Messages'},  
  {key: 'BarangayReports', label: 'Reports'}, 
  {key: 'BarangayClearance', label: 'Barangay Clearance'},  
  {key: 'BusinessPermit', label: 'Business Permit'},    
  {key: 'KatarunganPambarangay', label: 'Katarungang Pambarangay'},      
  {key: 'Login', label: 'Logout'}
];

@observer
export default class AdminSidebar extends React.Component {
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
                this.handlePress({key: 'MyBarangay'})
              }}
            >
              <View style={styles.loggedMemberContainer}>
                <Thumbnail 
                  circle 
                  source={BrgyAvatar} 
                  style={styles.loggedMemberAvatar}
                />
                <Text style={styles.loggedMemberName}>
                  {loggedUser.barangay_page_name}
                </Text>
                <Text style={styles.loggedMemberLocation}>
                  {loggedUser.barangay_page_municipality}
                </Text>
                <Text style={styles.loggedAdmin} numberOfLines={1}>
                  {`Logged in as ${loggedUser.user_first_name} ${loggedUser.user_last_name}`}
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
  },
  loggedAdmin: {
    alignSelf: 'center',
    color: colors.LIGHT,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 16.5,
    marginTop: 15,
    textAlign: 'center'
  }
});