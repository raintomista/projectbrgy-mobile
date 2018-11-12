import React, { Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import { action, observable, runInAction } from 'mobx';
import { Linking, StyleSheet, ToastAndroid, TouchableOpacity, ScrollableView, View } from 'react-native';
import { Body, Card, CardItem, Container, Content, Spinner, Text } from 'native-base';
import { HeaderWithGoBack } from 'components/common';
import NavigationService from 'services/NavigationService';
import { getClearance } from 'services/EService';
import RootStore from 'stores/RootStore';
import * as localized from 'localization/en';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts.js'

@observer
export default class ClearanceOverview extends Component {
  @observable inquiryId = null;
  @observable inquiry = null;

  @action
  setInquiryId(inquiryId) {
    this.inquiryId = inquiryId;
  }
  
  @action
  async getOverview() {
    try {
      const response = await getClearance(this.inquiryId);
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
        <Content style={styles.view} padder>
          {!this.inquiry && <Spinner color={colors.PRIMARY} />}
          {this.inquiry && (
            <Card style={styles.overviewCard}>
              <CardItem style={{paddingTop: 17}}>
                <Text style={styles.overviewTitle}>Barangay Clearance Form</Text>
              </CardItem>
              <CardItem style={{ paddingTop: 0, paddingBottom: 17 }}>
                <Body>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Applicant Name: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{`${this.inquiry.first_name} ${this.inquiry.middle_name } ${this.inquiry.last_name}`}</Text>
                  </Text>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Address: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.inquiry.address}</Text>
                  </Text>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Citizenship: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.inquiry.citizenship}</Text>
                  </Text>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Purpose: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.inquiry.purpose}</Text>
                  </Text>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Date of Birth: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.formatDate(this.inquiry.date_of_birth)}</Text>
                  </Text>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Place of Birth: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.inquiry.place_of_birth}</Text>
                  </Text>
                  <Text  style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Marital Status: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.inquiry.marital_status}</Text>
                  </Text>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Months / Years of Residency: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>
                      {this.inquiry.months_of_residency < 24
                          ? ` ${this.inquiry.months_of_residency} month/s`
                          : ` ${this.inquiry.months_of_residency / 12} years`
                        }
                    </Text>
                  </Text>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Date of Request: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.formatDate(this.inquiry.date_created)}</Text>
                  </Text>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Date of Pickup: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.formatDateWithTime(this.inquiry.pickup)}</Text>
                  </Text>
                  {this.inquiry.attachments.length > 0 && (
                    <React.Fragment>
                      <Text style={styles.overviewDetailLabel}>Attached Files: </Text>
                      {this.inquiry.attachments.map((attachment) => (
                        <TouchableOpacity onPress={() => Linking.openURL(attachment.link)} key={attachment.id}>
                            <Text style={styles.attachment}>
                            {attachment.filename}
                            </Text>
                        </TouchableOpacity>
                      ))}
                    </React.Fragment>
                  )}
                </Body>
              </CardItem>
            </Card>
          )}
        </Content>
      </Container>
    );
  }

  formatDate(date) {
    return moment(date).format('MMMM DD, YYYY');
  }

  formatDateWithTime(date){
    return moment(date).format('MMMM DD, YYYY (ha)');      
  }
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: colors.BACKGROUND,
  },
  overviewCard: {
    borderRadius: 0,
    elevation: 0,

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
    fontSize: 16
  },
  attachment: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 16,
    marginLeft: 5,
    marginBottom: 5,
    textDecorationLine: "underline"
  }
});