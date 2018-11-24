import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx';
import { FlatList, RefreshControl, StyleSheet, ToastAndroid, View } from 'react-native';
import { Container, Spinner } from 'native-base';
import { HeaderWithDrawer, EmptyState } from 'components/common';
import { BarangayReportItem } from 'components/member-reports';

import NavigationService from 'services/NavigationService';
import { getBrgyReports } from 'services/ReportService';
import RootStore from 'stores/RootStore';
import * as localized from 'localization/en';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts.js'

@observer
export default class BarangayReports extends Component {
  @observable page = 0;
  @observable limit = 20;
  @observable order = 'desc';
  @observable hasMore = true;
  @observable error = false;
  @observable refreshing = false;
  @observable reports = [];

  @action
  async getReports() {
    this.page += 1;

    try {
      const response = await getBrgyReports(this.page, this.limit, this.order);
      runInAction(() => {
        this.reports.push(...response.data.data.items);
      });
    } catch(e) {
      runInAction(() => {
        this.hasMore = false;
        this.error = true;
      });
    }
  }

  @action
  async refreshReports() {
    this.page = 1;
    this.refreshing = true;
    try {
      const response = await getBrgyReports(this.page, this.limit, this.order);
      runInAction(() => {
        this.hasMore = true;
        this.error = false;
        this.refreshing = false;
        this.reports = response.data.data.items
      });
    } catch (e) {
        runInAction(() => this.refreshing = false);
        ToastAndroid.show(localized.NETWORK_ERROR, ToastAndroid.SHORT);
    }
  }

  async componentWillMount() {
    const { sessionStore } = RootStore;
    await sessionStore.getLoggedUser();
    await this.getReports();
  }

  renderItem = ({item, index}) => {
    return (
      <BarangayReportItem
        reportId={item.inquiry_id}
        author={`${item.user_first_name} ${item.user_last_name}`}
        dateCreated={item.inquiry_date_created}    
        reportType={item.inquiry_report_type}
        committeeType={item.inquiry_committee_type}
        message={item.inquiry_message}
        status={item.inquiry_status}
        index={index}
        handlePress={() => this.handlePress(item.inquiry_id, index)}
      />
    )
  }

  renderLoader(hasMore) {
    if(hasMore === false) return null;
    return <Spinner color={colors.PRIMARY}/>
  }

  renderList(reports, hasMore, refreshing, error) {
    return (
      <FlatList
        data={Array.from(reports)}
        renderItem={this.renderItem}
        keyExtractor={(item) => item.inquiry_id}
        ListEmptyComponent={
          <EmptyState
            title="No reports yet." 
            detail="Please check again later."
          />
        }
        ListFooterComponent={() => this.renderLoader(hasMore)}
        onEndReached={() => this.handleLoadMore(error)}
        onEndReachedThreshold={3}
        initialNumToRender={10}
        maxToRenderPerBatch={10}    
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => this.handleRefresh()}
            colors={[colors.PRIMARY]}
          />
        }
      />
    );
  }

  render() {
    return (
      <Container>
        <HeaderWithDrawer title="Reports" />
        <View style={{ flex: 1 }}>
          {this.renderList(this.reports, this.hasMore, this.refreshing, this.error)}
        </View>
      </Container>
    );
  }

  handleLoadMore(error) {
    if(!error) {
      this.getReports();
    }
  }

  handleRefresh(refreshing) {
    this.refreshReports();
  }

  @action
  handlePress(reportId, index) {
    const newReports = this.reports.slice();
    newReports[index].inquiry_status = newReports[index].inquiry_status === 'unread' ? 'read' : newReports[index].inquiry_status;
    this.reports = newReports;
    NavigationService.push('ReportOverview', { reportId });
    
  }
}

const styles = StyleSheet.create({
});