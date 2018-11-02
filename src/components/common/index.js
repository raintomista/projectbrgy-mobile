import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { DrawerActions, StackActions } from "react-navigation";
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
import NavigationService from 'services/NavigationService';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

export const HeaderWithDrawer = (props) => (
  <Header style={styles.header}>
    <Left>
      <Button
        transparent
        onPress={() => NavigationService.dispatch(DrawerActions.openDrawer())}
      >
        <Icon name="menu" />
      </Button>
    </Left> 
    <Body>
      <Title style={styles.headerTitle}>
        {props.title}
      </Title>
    </Body>
    <Right />
  </Header>
);

export const HeaderWithGoBack = observer((props) => (
  <Header style={styles.header}>
    <Left>
      <Button
        transparent
        onPress={() => NavigationService.dispatch(StackActions.pop())}
      >
        <Icon name="arrow-back" />
      </Button>
    </Left> 
    <Body>
      <Title style={styles.headerTitle}>
        {props.title}
      </Title>
    </Body>
    <Right />
  </Header>
));

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.PRIMARY
  },
  headerTitle: {
    fontFamily: fonts.MONTSERRAT_BOLD
  }
});
