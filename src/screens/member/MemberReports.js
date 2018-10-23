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
  async componentWillMount() {
    const { sessionStore, reportStore } = this.props.screenProps;
    await sessionStore.getLoggedUser();
    await reportStore.getMyReports(sessionStore.loggedUser.user_id);
  }

  renderItem = ({ item, index}) => (
    <ReportItem
      dataCreated={item.date_created}    
      reportType={item.report_type}
      committeeType={item.committee_type}
      message={item.message}
    />
  );

  renderList() {
    const { reportStore} = this.props.screenProps;
    const { myReports } = reportStore;

    return (
      <FlatList
        data={Array.from(myReports)}
        renderItem={this.renderItem}
        keyExtractor={(item) => item.id}
      />
    );
  }
  render() {
    return (
      <Container>
        <HeaderWithDrawer title="Reports" />
        <View style={styles.view}>
          {this.renderList()}
        </View>
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
  view: {
    padding: 12
  },
  fab: {
    backgroundColor: colors.PRIMARY
  }
});