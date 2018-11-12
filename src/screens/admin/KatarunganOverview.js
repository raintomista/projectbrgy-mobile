import React, { Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import { action, observable, runInAction } from 'mobx';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { Body, Card, CardItem, Container, Spinner, Text } from 'native-base';
import { HeaderWithGoBack } from 'components/common';
import NavigationService from 'services/NavigationService';
import { getComplaint } from 'services/EService';
import RootStore from 'stores/RootStore';
import * as localized from 'localization/en';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts.js'

@observer
export default class KatarunganOverview extends Component {
  @observable inquiryId = null;
  @observable inquiry = null;

  @action
  setInquiryId(inquiryId) {
    this.inquiryId = inquiryId;
  }
  
  @action
  async getOverview() {
    try {
      const response = await getComplaint(this.inquiryId);
      runInAction(() => this.inquiry = response.data.data);
    } catch(e) {
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  async componentWillMount(){
    await RootStore.sessionStore.getLoggedUser();
    const params = NavigationService.getActiveScreenParams();
    await this.setInquiryId(params.inquiryId);
    await this.getOverview();
    
  }

  render() {
    return (
      <Container>
        <HeaderWithGoBack title="Overview" />
        <View style={styles.view}>
          {!this.inquiry && <Spinner color={colors.PRIMARY} />}
          {this.inquiry && (
            <Card style={styles.overviewCard}>
              <CardItem>
                <Text style={styles.overviewTitle}>Katarungan Pambarangay Form</Text>
              </CardItem>
              <CardItem style={{ paddingTop: 0 }}>
                <Body>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Name of Complainant: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.inquiry.name_of_complainant}</Text>
                  </Text>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Address of Complainant: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.inquiry.address_of_complainant}</Text>
                  </Text>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Name of Offender: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.inquiry.name_of_offender}</Text>
                  </Text>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Address of Offender: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.inquiry.address_of_offender}</Text>
                  </Text>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Allegation/s: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.inquiry.allegations}</Text>
                  </Text>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Date of Incident: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.formatDate(this.inquiry.date_of_incident)}</Text>
                  </Text>
                  <Text  style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Date of Filling: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.formatDate(this.inquiry.date_created)}</Text>
                  </Text>
                  <Text style={styles.overviewDetailLabel}>Details of Incident: </Text>
                  <Text style={styles.overviewDetailText}>{this.inquiry.details_of_incident}</Text>                
                </Body>
              </CardItem>
            </Card>
          )}
        </View>
      </Container>
    );
  }

  formatDate(date) {
    return moment(date).format('MMMM DD, YYYY');
  }
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: colors.BACKGROUND,
    flex: 1
  },
  overviewCard: {
    borderRadius: 0,
    elevation: 0,
    marginTop: 12,
    marginLeft: 12,
    marginRight: 12
  },
  overviewTitle: {
    color: colors.PRIMARY,
    fontFamily: fonts.MONTSERRAT_BOLD,
    fontSize: 18,
    fontWeight: 'normal',
  },
  overviewDetailLabel: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_BOLD,
    fontSize: 16
  },
  overviewDetailText: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 16,
  }
});