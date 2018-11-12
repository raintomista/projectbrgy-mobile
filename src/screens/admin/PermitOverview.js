import React, { Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import { action, observable, runInAction } from 'mobx';
import { Linking, StyleSheet, ToastAndroid, TouchableOpacity, ScrollableView, View } from 'react-native';
import { Body, Card, CardItem, Container, Content, Spinner, Text } from 'native-base';
import { HeaderWithGoBack } from 'components/common';
import NavigationService from 'services/NavigationService';
import { getPermit } from 'services/EService';
import RootStore from 'stores/RootStore';
import * as localized from 'localization/en';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts.js'

@observer
export default class PermitOverview extends Component {
  @observable inquiryId = null;
  @observable inquiry = null;

  @action
  setInquiryId(inquiryId) {
    this.inquiryId = inquiryId;
  }
  
  @action
  async getOverview() {
    try {
      const response = await getPermit(this.inquiryId);
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
        <HeaderWithGoBack title="Permit Overview" />
        <Content style={styles.view} padder>
          {!this.inquiry && <Spinner color={colors.PRIMARY} />}
          {this.inquiry && (
            <Card style={styles.overviewCard}>
              <CardItem style={{paddingTop: 17}}>
                <Text style={styles.overviewTitle}>Business Permit Form</Text>
              </CardItem>
              <CardItem style={{ paddingTop: 0, paddingBottom: 17 }}>
                <Body>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Name of Proprietor/Owner: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.inquiry.name_of_owner}</Text>
                  </Text>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Address of Proprietor/Owner: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.inquiry.address_of_owner}</Text>
                  </Text>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Business/Trade Name: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.inquiry.name_of_business}</Text>
                  </Text>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Address of Business: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.inquiry.address_of_business}</Text>
                  </Text>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Type of Service: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.inquiry.type_of_service}</Text>
                  </Text>
                  <Text style={{ marginBottom: 8 }}>
                    <Text style={styles.overviewDetailLabel}>Date of Request: &nbsp;</Text>
                    <Text style={styles.overviewDetailText}>{this.formatDate(this.inquiry.date_created)}</Text>
                  </Text>
                  <Text  style={{ marginBottom: 8 }}>
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
    fontSize: 16.5
  },
  overviewDetailText: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 16.5
  },
  attachment: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 16.5,
    marginLeft: 5,
    marginBottom: 5,
    textDecorationLine: "underline"
  }
});