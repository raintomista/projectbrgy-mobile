import React from "react";
import { observer } from 'mobx-react';
import { AppRegistry, AsyncStorage, Image, StatusBar } from "react-native";
import { Container, Content, Text, List, ListItem } from "native-base";
import { getUserDetails } from '../../services/AuthService';
import RootStore from 'stores/RootStore';

const routes = [
  {key: 'Home', label: 'Home'},
  {key: 'Search', label: 'Search'},
  {key: 'MyBarangay', label: 'My Barangay'},  
  {key: 'Messages', label: 'Messages'},  
  {key: 'MyProfile', label: 'Profile'},    
  {key: 'MyFollowing', label: 'Following'},  
  {key: 'MyReportStack', label: 'Reports'}, 
  {key: 'MyRespondedReportStack', label: 'Responded'},    
];

@observer
export default class MemberSidebar extends React.Component {
  render() {
    return (
      <Container>
        <Content>
          <List
            dataArray={routes}
            renderRow={(route) => {
              return (
                <ListItem button
                  onPress={() => {
                    this.handlePress(route)
                  }}
                >
                  <Text>{route.label}</Text>
                </ListItem>
              );
            }}
          />
        </Content>
      </Container>
    );
  }

  async handlePress(route) {
    if(route.key === 'MyBarangay') {
      const brgyId = await AsyncStorage.getItem('brgy-id');
      await RootStore.brgyPageStore.setBrgyId(brgyId);
    }
    this.props.navigation.navigate(route.key);                    
  }
}