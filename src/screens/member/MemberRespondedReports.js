import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { 
  Container, 
  Content,
  Fab,
  Icon,
  Spinner
} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { responsiveHeight } from 'react-native-cross-platform-responsive-dimensions'
import { HeaderWithDrawer, EmptyState } from 'components/common';
import { RespondedReportItem } from 'components/member-reports';
import NavigationService from 'services/NavigationService';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts.js'

@observer
export default class MemberRespondedReports extends Component {
  async componentWillMount() {
    const { sessionStore, reportStore } = this.props.screenProps;
    await sessionStore.getLoggedUser();
    await reportStore.getMyRespondedReports();
  }

  componentWillUnmount() {
    const { reportStore } = this.props.screenProps;
    reportStore.resetStore();
  }

  renderItem = ({ item, index}) => (
    <RespondedReportItem
      reportId={item.id}
      dateUpdated={item.date_updated}    
      reportType={item.report_type}
      committeeType={item.committee_type}
      message={item.message}
      index={index}
    />
  );

  renderLoader(hasMore) {
    if(hasMore === false) return null;
    return <Spinner color={colors.PRIMARY}/>
  }

  renderList() {
    const { reportStore} = this.props.screenProps;
    const { myReports, hasMore, refreshing } = reportStore;

    return (
      <FlatList
        data={Array.from(myReports)}
        renderItem={this.renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyState
            title="No responded reports yet." 
            detail="Please check again later."
          />
        }
        ListFooterComponent={() => this.renderLoader(hasMore)}
        onEndReached={() => this.handleLoadMore()}
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
        <HeaderWithDrawer title="Responded" />
        <View style={{ flex: 1 }}>
          {this.renderList()}
        </View>
      </Container>
    );
  }

  async handleLoadMore() {
    const { reportStore } = this.props.screenProps;
    if(!reportStore.error) {
      await reportStore.getMyRespondedReports();
    }
  }

  async handleRefresh() {
    const { reportStore } = this.props.screenProps;
    await reportStore.refreshMyRespondedReports();
  }
}

const styles = StyleSheet.create({
});