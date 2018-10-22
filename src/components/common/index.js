import React from 'react';
import { StyleSheet } from 'react-native';
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
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

export const HeaderWithDrawer = (props) => (
  <Header style={styles.header}>
    <Left>
      <Button
        transparent
        onPress={() => {
          props.navigation
            .dispatch(DrawerActions.openDrawer())
        }}
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

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.PRIMARY
  },
  headerTitle: {
    fontFamily: fonts.MONTSERRAT_BOLD
  }
});
