import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx';
import { AsyncStorage, StyleSheet, ScrollView, ToastAndroid, View } from 'react-native';
import { Container, Content, Spinner } from 'native-base';
import { Table, TableWrapper, Row } from 'react-native-table-component';
import { HeaderWithDrawer } from 'components/common';
import { getResidents } from 'services/BrgyPageService';
import * as localized from 'localization/en';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts.js'

@observer
export default class BarangayResidents extends Component {
  @observable tableHeader = ['#', 'Full Name', ' Email', 'Landline', 'Mobile'];
  @observable tableWidth = [65, 200, 200, 150, 150];
  @observable tableData = null;

  @action
  async getMyResidents(brgyId) {
    try {
      const response = await getResidents(brgyId);
      runInAction(() => this.tableData = response.data.data.items);
    } catch(e) {
      ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
    }
  }


  async componentWillMount() {
    const brgyId = await AsyncStorage.getItem('brgy-id');
    this.getMyResidents(brgyId);
  }

  render() {
    return (
      <Container>
        <HeaderWithDrawer title="My Residents" />
        <View style={styles.view}>
          {!this.tableData && (
            <View style={styles.loader}>
              <Spinner color={colors.PRIMARY} />
            </View>
          )}
          {this.tableData && (
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
                    <Table borderStyle={{ borderWidth: 0}} style={styles.tableData}>
                      {this.tableData.length > 0 && this.tableData.map((data, index) => {
                        const rowData = [];
                        rowData.push(index+1);
                        rowData.push(`${data.first_name} ${data.last_name}`);
                        rowData.push(data.email)
                        rowData.push(data.landline_number ? data.landline_number : 'n/a');
                        rowData.push(data.mobile_number ? data.mobile_number : 'n/a')

                        return (
                          <Row 
                            key={index}
                            data={rowData} 
                            widthArr={Array.from(this.tableWidth)}
                            style={styles.tableDataRow}
                            textStyle={styles.tableDataText}
                          />  
                        );
                      })}
                    </Table>
                  </ScrollView>
              </View>
            </ScrollView>
          )}
        </View>
      </Container>
    );
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
  tableData: {
    backgroundColor: colors.LIGHT,
    paddingHorizontal: 20,
    paddingBottom: 15
  },
  tableDataRow: {
    borderTopWidth: 1,
    borderTopColor: colors.GRAY,
  },
  tableDataText: {
    color: colors.DARK,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 15
  }
});