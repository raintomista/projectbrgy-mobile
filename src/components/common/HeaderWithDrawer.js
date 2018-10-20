import React from 'react';
import { DrawerActions } from "react-navigation";
import { 
  Header,
  Container, 
  Left, 
  Right,
  Body,
  Title, 
  Content,
  Icon,  
  Button, 
  Text,  
} from 'native-base';

const HeaderWithDrawer = (props) => (
  <Header>
    <Left>
      <Button
        transparent
        onPress={() => props.navigation.dispatch(DrawerActions.openDrawer())}>
        <Icon name="menu" />
      </Button>
    </Left>
    <Body>
      <Title>{props.title}</Title>
    </Body>
    <Right />
  </Header>
);

export default HeaderWithDrawer;