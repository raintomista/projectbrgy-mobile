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
import { HeaderWithDrawer } from 'components/common';
import { ReportItem } from 'components/member-reports';
import NavigationService from 'services/NavigationService';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts.js'

@observer
export default class MemberReports extends Component {
  async componentWillMount() {
    const { sessionStore, reportStore } = this.props.screenProps;
    await sessionStore.getLoggedUser();
    await reportStore.getMyReports();
  }

  componentWillUnmount() {
    const { reportStore } = this.props.screenProps;
    reportStore.resetStore();
  }

  renderItem = ({ item, index}) => (
    <ReportItem
      dateCreated={item.date_created}    
      reportType={item.report_type}
      committeeType={item.committee_type}
      message={item.message}
      index={index}
    />
  );

  renderLoader() {
    const { reportStore } = this.props.screenProps;
    const { error, followingList, hasMore } = reportStore;
    if(hasMore === false) return null;
    return <Spinner color={colors.PRIMARY}/>
  }

  renderList() {
    const { reportStore} = this.props.screenProps;
    const { myReports, refreshing } = reportStore;

    return (
      <FlatList
        data={Array.from(myReports)}
        renderItem={this.renderItem}
        keyExtractor={(item) => item.id}
        ListFooterComponent={() => this.renderLoader()}
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
        <HeaderWithDrawer title="Reports" />
        <View style={{ flex: 1 }}>
          {this.renderList()}
        </View>
        <Fab
          style={{ backgroundColor: colors.PRIMARY }}
          position="bottomRight"
          onPress={() => {
            NavigationService.push('CreateReport', {});
          }}
        >
          <Icon name="add" />
        </Fab>
      </Container>
    );
  }

  async handleLoadMore() {
    const { reportStore } = this.props.screenProps;
    if(!reportStore.error) {
      await reportStore.getMyReports();
    }
  }

  async handleRefresh() {
    const { reportStore } = this.props.screenProps;
    await reportStore.refreshMyReports();
  }
}

const styles = StyleSheet.create({
});