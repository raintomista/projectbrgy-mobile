import React, { Component } from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx';
import { AsyncStorage, Dimensions, StyleSheet, ScrollView, TouchableOpacity, ToastAndroid, View } from 'react-native';
import { Container, Content, Spinner, Text } from 'native-base';
import { Table, TableWrapper, Row } from 'react-native-table-component';
import { HeaderWithDrawer } from 'components/common';
import { getAllComplaints } from 'services/EService';
import * as localized from 'localization/en';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts.js'

@observer
export default class BarangayKatarungan extends Component {
  @observable page = 0;
  @observable limit = 20;
  @observable order = 'desc';
  @observable tableHeader = ['Complainant', ' Offender Name', 'Allegation/s', 'Complaint Date'];
  @observable tableWidth = [200, 200, 220, 220];
  @observable tableData = [];

  @action
  async getComplaints(brgyId) {
    this.page += 1;
    try {
      const response = await getAllComplaints(brgyId, this.page, this.limit, this.order);
      if(response.data.data.katarungang_pambarangay.length > 0) {
        runInAction(() => this.tableData.push(...response.data.data.katarungang_pambarangay));
      }
    } catch(e) {
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }

  async componentWillMount() {
    const brgyId = await AsyncStorage.getItem('brgy-id');
    this.getComplaints(brgyId);
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

  render() {
    return (
      <Container>
        <HeaderWithDrawer title="Katarungang Pambarangay Complaints" />
        <View style={styles.view}>
          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{borderWidth: 0}} style={styles.tableHeader}>
                <Row 
                  data={Array.from(this.tableHeader)} 
                  widthArr={Array.from(this.tableWidth)}  
                  style={styles.tableHeaderRow}
                  textStyle={styles.tableHeaderText}
                />
              </Table>
                <ScrollView>
                  <Table  borderStyle={{borderWidth: 0}}>
                    <TableWrapper>
                      {this.tableData.map((data, index) => {
                        const rowData = [];
                        rowData.push(this.renderCell(data.name_of_complainant, data.status));
                        rowData.push(this.renderCell(data.name_of_offender, data.status));
                        rowData.push(this.renderCell(data.allegations, data.status));
                        rowData.push(this.renderCell(this.formatDate(data.date_created), data.status));

                        return (
                          <TouchableOpacity>
                            <Row 
                              key={index}
                              data={rowData} 
                              widthArr={Array.from(this.tableWidth)}
                              borderStyle={{borderWidth: 0}}
                              style={[data.status === 'unread' ? styles.tableDataUnreadRow : styles.tableDataRow, index === 0 && {borderTopWidth: 0}]}
                            />  
                          </TouchableOpacity>
                        );
                      })}
                    </TableWrapper>
                  </Table>
                </ScrollView>
            </View>
          </ScrollView>
        </View>
      </Container>
    );
  }

  formatDate(date) {
    return moment(date).format('MMM D, YYYY [at] h:mm a');
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
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  tableDataRow: {
    backgroundColor: colors.LIGHT,
    borderTopWidth: 1,
    borderTopColor: '#d2d2d2',
    paddingLeft: 20,
    paddingRight: 20,
    width: null
  },
  tableDataText: {
    color: colors.DARK,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 15,
  },
  tableDataUnreadRow: {
    backgroundColor: '#dee2e6',
    borderTopWidth: 1,
    borderTopColor: '#d2d2d2',
    paddingLeft: 20,
    paddingRight: 20,
    width: null
  },
  tableDataUnreadText: {
    color: colors.DARK,
    fontFamily: fonts.LATO_BOLD,
    fontSize: 15,
  },
});