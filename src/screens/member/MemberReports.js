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
import { HeaderWithDrawer } from 'components/common';
import { ReportItem } from 'components/member-reports';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts.js'

@observer
export default class MemberReports extends Component {
  render() {
    return (
      <Container>
        <HeaderWithDrawer title="Reports" />
        <Content padder>
          <ReportItem />
          <ReportItem />
          <ReportItem />
          <ReportItem />
          
        </Content>
        <Fab
          style={styles.fab}
          position="bottomRight"
        >
          <Icon name="add" />
        </Fab>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: colors.PRIMARY
  }
});