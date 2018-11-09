import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx';
import { FlatList, RefreshControl, StyleSheet, ScrollView, View } from 'react-native';
import { 
  Accordion,
  Body,
  Card,
  CardItem,
  Container, 
  Content,
  Spinner,
  Text
} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { HeaderWithGoBack } from 'components/common';
import { ReportOverviewItem, ReportResponseHeader,ReportResponseContent } from 'components/member-reports';
import NavigationService from 'services/NavigationService';
import {
  getReportById as _getReportById,
  getReportResponses as _getReportResponses
} from 'services/ReportService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts.js'

@observer
export default class MemberReportOverview extends Component {
  @observable page = 0;
  @observable hasMore = true;
  @observable error = false;
  @observable skip = 0;
  @observable reportId= null;
  @observable report = null;
  @observable responses = [];

  @action
  setReportId(reportId) {
    this.reportId = reportId;
  }

  @action
  async getReportById() {
    try {
      const response = await _getReportById(this.reportId);
      runInAction(() => this.report = response.data.data);
    } catch(e) {
      runInAction(() => this.report = null);            
      ToastAndroid.show(localized.NETWORK_ERROR, ToastAndroid.SHORT);
    }
  }

  @action
  async getResponses() {
    this.page += 1;
    try {
      const response = await _getReportResponses(this.reportId, this.page, this.limit, this.order, this.skip);
      if(response.data.data.inquiry_admin_response.length > 0) {
        runInAction(() => {
          this.responses.push(...response.data.data.inquiry_admin_response);
        });
      } else {
        runInAction(() => {
          this.hasMore = false;
          this.error = true;
        });
      }
    } catch (e) {
      runInAction(() => {
        this.hasMore = false;
        this.error = true;
      });
      ToastAndroid.show(localized.NETWORK_ERROR, ToastAndroid.SHORT);
    }
  }

  async componentWillMount(){
    await RootStore.sessionStore.getLoggedUser();
    const params = NavigationService.getActiveScreenParams();
    await this.setReportId(params.reportId);
    await this.getReportById();
    await this.getResponses();
  }



  renderHeader(item) {
    return (
      <ReportResponseHeader
      />
    )
  }

  renderContent(item) {
    return <ReportResponseContent />
  }

  renderItem = ({item, index}) => (
    <Card style={styles.responseCard}>
      <CardItem style={{flexDirection: 'row'}}>
        <Accordion
          dataArray={[{a: 1}]}
          renderHeader={this.renderHeader}
          renderContent={this.renderContent}          
          style={{flexGrow: 1}}
        />
      </CardItem>
    </Card>
  );

  renderLoader(hasMore) {
    if(hasMore === false) return null;
    return <Spinner color={colors.PRIMARY}/>
  }

  renderList(responses, hasMore, error) {
    return (
      <FlatList
        data={Array.from(responses)}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
        ListFooterComponent={() => this.renderLoader(hasMore)}
        onEndReached={() => this.handleLoadMore(error)}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}    
      />
    )
  }

  render() {
    return (
      <Container>
        <HeaderWithGoBack title="Overview" />
        <View style={styles.view}>
          {!this.report && <Spinner color={colors.PRIMARY} />}
          {this.report && (
            <ScrollView>
              <ReportOverviewItem
                dateCreated={this.report.inquiry_date_created}    
                reportType={this.report.inquiry_report_type}
                committeeType={this.report.inquiry_committee_type}
                message={this.report.inquiry_message}
              />
              {this.renderList(this.responses, this.hasMore, this.error)}
            </ScrollView>
          )}
        </View>
      </Container>
    );
  }

  handleLoadMore(error) {
    if(!error) {
      this.getResponses();
    }
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  responseCard: {
    marginTop: 0,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 12
  }
});