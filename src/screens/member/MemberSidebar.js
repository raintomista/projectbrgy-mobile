import React from "react";
import { observer } from 'mobx-react';
import { AppRegistry, Image, StatusBar } from "react-native";
import { Container, Content, Text, List, ListItem } from "native-base";
import { getUserDetails } from '../../services/AuthService';
import RootStore from 'stores/RootStore';

const routes = [
  {key: 'Home', label: 'Home'},
  {key: 'BarangayPage', label: 'My Barangay'},  
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

  handlePress(route) {
    this.props.navigation.navigate(route.key);                    
  }
}