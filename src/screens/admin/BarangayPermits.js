import React, { Component } from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx';
import { AsyncStorage, FlatList, Dimensions, StyleSheet, ScrollView, TouchableOpacity, ToastAndroid, View } from 'react-native';
import { Container, Content, Spinner, Text } from 'native-base';
import { Table, TableWrapper, Row } from 'react-native-table-component';
import { HeaderWithDrawer } from 'components/common';
import { getAllPermits } from 'services/EService';
import NavigationService from 'services/NavigationService';
import * as localized from 'localization/en';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts.js'

@observer
export default class BarangayPermits extends Component {
  @observable page = 0;
  @observable limit = 20;
  @observable hasMore = true;

  @observable tableHeader = ['Applicant Name', ' Business Name', 'Request Date'];
  @observable tableWidth = [200, 200, 210];
  @observable tableData = null;

  @action
  async getPermits(brgyId) {
    this.page += 1;
    try {
      const response = await getAllPermits(brgyId, this.page, this.limit);   
      if(response.data.data.business_permit.length > 0) {
        runInAction(() => {
          if(!this.tableData) {
            this.tableData = response.data.data.business_permit;
          } else {
            this.tableData.push(...response.data.data.business_permit);
          }
        });
      } else {
        runInAction(() => {
          this.tableData.push(...response.data.data.business_permit);
          this.hasMore = false;
          this.error = true;
        });
      }
    } catch(e) {
      runInAction(() => {
        this.hasMore = false;
        this.error = true;
      });
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  async componentWillMount() {
    const brgyId = await AsyncStorage.getItem('brgy-id');
    this.getPermits(brgyId);
  }

  renderCell(value, status) {
    return (
      <View style={{ borderTopWidth: 0, paddingHorizontal: 10, paddingVertical: 15 }}>
        <Text 
          style={status === 'unread' ? styles.tableDataUnreadText : styles.tableDataText}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    );
  }

  renderItem = ({item, index}) => {
    const rowData = [];
    rowData.push(this.renderCell(item.name_of_owner, item.status));
    rowData.push(this.renderCell(item.name_of_business, item.status));
    rowData.push(this.renderCell(this.formatDate(item.date_created), item.status));

    return (
      <TouchableOpacity onPress={() => this.handlePress(item, index)}>
        <Row 
          key={index}
          data={rowData} 
          widthArr={Array.from(this.tableWidth)}
          borderStyle={{borderWidth: 0}}
          style={[item.status === 'unread' ? styles.tableDataUnreadRow : styles.tableDataRow, index === 0 && {borderTopWidth: 0}]}
        />  
      </TouchableOpacity>
    );
  }

  renderLoader(hasMore) {
    if(hasMore === false) return null;
    return (
      <Spinner 
        color={colors.PRIMARY} 
        style={{ backgroundColor: colors.LIGHT }} 
      />
    );
  }

  renderList(tableData, hasMore, error) {
    return (
      <FlatList
        data={Array.from(tableData)}
        renderItem={(props) => this.renderItem(props)}
        keyExtractor={(item) => item.id}
        onEndReached={() => this.handleLoadMore(error)}
        onEndReachedThreshold={1}
        initialNumToRender={10}
        maxToRenderPerBatch={10}    
        ListFooterComponent={() => this.renderLoader(hasMore)} 
      />
    );
  }

  render() {
    return (
      <Container>
        <HeaderWithDrawer title="Business Permit Requests" />
        <View style={styles.view}>
          {!this.tableData && (
            <Spinner color={colors.PRIMARY} />
          )}
          {this.tableData && (
            <ScrollView horizontal={true} style={{ flexGrow: 0 }}>
              <View>
                <Table borderStyle={{borderWidth: 0}} style={styles.tableHeader}>
                  <Row 
                    data={Array.from(this.tableHeader)} 
                    widthArr={Array.from(this.tableWidth)}  
                    style={styles.tableHeaderRow}
                    textStyle={styles.tableHeaderText}
                  />
                </Table>
                <ScrollView style={{marginLeft: -1, marginBottom: -1}}>
                  <Table>
                    <TableWrapper>
                      {this.renderList(this.tableData, this.hasMore, this.error)}
                    </TableWrapper>
                  </Table>
                </ScrollView>
              </View>
            </ScrollView>
          )}       
        </View>
      </Container>
    );
  }

  async handleLoadMore(error) {
    const brgyId = await AsyncStorage.getItem('brgy-id');
    if(!error) {
      this.getPermits(brgyId);
    }
  }

  formatDate(date) {
    return moment(date).format('MMM D, YYYY [at] h:mm a');
  }

  @action
  handlePress(item, index) {
    const newData = this.tableData.slice();
    newData[index].status = 'read';
    
    runInAction(() => this.tableData = newData);
    NavigationService.push('PermitOverview', { inquiryId: item.id});
  }
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: colors.BACKGROUND,
    flex: 1,
    padding: 12
  },
  loader: {
    flex: 1, 
  },
  tableHeader: {
    backgroundColor: colors.LIGHT,
    paddingHorizontal: 20,
    paddingTop: 15
  },
  tableHeaderText: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_BOLD,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  tableDataRow: {
    backgroundColor: colors.LIGHT,
    borderTopWidth: 1,
    borderTopColor: '#d2d2d2',
    paddingLeft: 23,
    paddingRight: 20,
    width: null
  },
  tableDataText: {
    color: colors.DARK,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 16,
  },
  tableDataUnreadRow: {
    backgroundColor: '#dee2e6',
    borderTopWidth: 1,
    borderTopColor: '#d2d2d2',
    paddingLeft: 23,
    paddingRight: 20,
    width: null
  },
  tableDataUnreadText: {
    color: colors.DARK,
    fontFamily: fonts.LATO_BOLD,
    fontSize: 16,
  },
});