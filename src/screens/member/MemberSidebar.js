import React from "react";
import { AppRegistry, Image, StatusBar } from "react-native";
import { Container, Content, Text, List, ListItem } from "native-base";
const routes = [
  {key: 'Home', label: 'Home'},
  {key: 'BarangayPage', label: 'My Barangay'},  
  {key: 'Messages', label: 'Messages'},  
  {key: 'ProfileFollowing', label: 'Following'},  
  {key: 'Reports', label: 'Reports'}, 
  {key: 'Responded', label: 'Responded'},    
];


export default class MemberSidebar extends React.Component {
  render() {
    return (
      <Container>
        <Content>
          <List
            dataArray={routes}
            renderRow={(route) => {
              return (
                <ListItem
                  button
                  onPress={() => this.props.navigation.navigate(route.key)}>
                  <Text>{route.label}</Text>
                </ListItem>
              );
            }}
          />
        </Content>
      </Container>
    );
  }
}