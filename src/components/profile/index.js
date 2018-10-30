import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { StyleSheet } from 'react-native';
import { 
  Body,
  Card, 
  CardItem,
  Left, 
  ListItem,
  Right,
  Text,
} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';


export const BarangayInformationCard = observer((props) => (
  <Card style={styles.card}>
    <CardItem>
      <Body>
        <Text style={styles.cardTitle}>Barangay Information</Text>
        <Text style={styles.cardDetails}>Region: {props.region}</Text>
        <Text style={styles.cardDetails}>Province: {props.province}</Text>
        <Text style={styles.cardDetails}>City/Municipality: {props.municipality}</Text>
        <Text style={styles.cardDetails}>Barangay: {props.barangay}</Text>
        <Text style={styles.cardDetails}>Barangay Captain: {props.barangayCaptain}</Text>
        <Text style={styles.cardDetails}>Barangay Office Address: {props.barangayAddress}</Text>
      </Body>
    </CardItem>
  </Card>
));

export const ContactInformationCard = observer((props) => (
  <Card style={styles.card}>
    <CardItem>
      <Body>
        <Text style={styles.cardTitle}>
          Contact Information
        </Text>
        {props.email && (
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
              <Text style={styles.cardCredential}>
                {props.email}
              </Text>
            </Right>
          </ListItem>
        )}
        {props.mobile && (
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
              <Text style={styles.cardCredential}>
                {props.mobile}
              </Text>
            </Right>
          </ListItem>
        )}
        {props.landline && (
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
              <Text style={styles.cardCredential}>
                {props.landline}
              </Text>
            </Right>
          </ListItem>
        )}
      </Body>
    </CardItem>
  </Card>
));

const styles = StyleSheet.create({
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