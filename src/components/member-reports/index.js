import React from 'react';
import { observer } from 'mobx-react';
import { StyleSheet } from 'react-native';
import { 
    Body,
    Card,
    CardItem,
    Container, 
    Content,
    Text,
    Spinner
  } from 'native-base';
import NavigationService from 'services/NavigationService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';


export const ReportItem = observer((props) => (
  <Card style={styles.card}>
    <CardItem style={styles.cardHeader}>
      <Body>
      <Text style={styles.cardTitle}>Committee Report</Text>     
      <Text note>Inquiry &middot; October 27, 2019</Text>       
      </Body>              
    </CardItem>
    <CardItem style={styles.cardBody}>
      <Body>
        <Text note numberOfLines={1}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley 
        </Text>
      </Body>
    </CardItem>
  </Card>
));

const styles = StyleSheet.create({
  card: {
    borderRadius: 0,
    marginBottom: 10,
  },
  cardTitle: {
    color: colors.PRIMARY,
    fontFamily: fonts.MONTSERRAT_BOLD,
    fontSize: 18,
  },
  cardBody: {
    paddingTop: 0,
    paddingBottom: 14
  }
});