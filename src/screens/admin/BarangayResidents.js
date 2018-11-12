import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx';
import { FlatList, RefreshControl, StyleSheet, ScrollView, View } from 'react-native';
import { Container, Content } from 'native-base';

import { Table, TableWrapper, Row } from 'react-native-table-component';


import { HeaderWithDrawer } from 'components/common';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts.js'

@observer
export default class BarangayResidents extends Component {
  @observable tableHeader = ['#', 'Full Name', ' Email', 'Landline', 'Mobile'];
  @observable tableWidth = [50, 300, 150, 150, 150];
  @observable tableData= [
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['2', 'Pan Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
    ['1', 'Rainier Tomista', 'rftomista@up.edu.ph', '09959786692', '4141451'],
      
  ]
  render() {
    return (
      <Container>
        <HeaderWithDrawer title="My Residents" />
        <View style={styles.view}>
          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{borderWidth: 0}}>
                <Row 
                  data={Array.from(this.tableHeader)} 
                  widthArr={Array.from(this.tableWidth)}  
                  style={styles.tableHeaderRow}
                  textStyle={styles.tableHeaderText}
                />
              </Table>
              <ScrollView>
                <Table borderStyle={{borderWidth: 0}}>
                  {this.tableData.map((row, index) => (
                    <Row 
                      key={index}
                      data={Array.from(row)} 
                      widthArr={Array.from(this.tableWidth)}
                      style={styles.tableDataRow}
                      textStyle={styles.tableDataText}
                    />  
                  ))}
                </Table>
              </ScrollView>
            </View>
          </ScrollView>
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
  tableHeaderRow: {
    backgroundColor: colors.LIGHT,
  },
  tableHeaderText: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_BOLD,
    padding: 20
  },
  tableDataRow: {
    backgroundColor: colors.LIGHT,
    borderTopWidth: 1,
    borderTopColor: colors.GRAY,
  },
  tableDataText: {
    color: colors.DARK,
    fontFamily: fonts.LATO_REGULAR,
    paddingHorizontal: 20,
    paddingVertical: 10
  }
});