import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { 
  Container, 
  Content,
  Spinner
} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { HeaderWithGoBack } from 'components/common';
import { ReportOverviewItem } from 'components/member-reports';
import NavigationService from 'services/NavigationService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts.js'

@observer
export default class MemberReportOverview extends Component {
    async componentWillMount() {
      const { reportStore } = RootStore;
      await reportStore.getReportById();
    }
    render() {
      const { reportStore } = RootStore;
      const { report } = reportStore;
      
      return (
        <Container>
          <HeaderWithGoBack title="Overview" />
          <View style={{ flex: 1}}>
            {report && (
              <ReportOverviewItem
                dateCreated={report.inquiry_date_created}    
                reportType={report.inquiry_report_type}
                committeeType={report.inquiry_committee_type}
                message={report.inquiry_message}
              />
            )}
          </View>
        </Container>
      );
    }
}

const styles = StyleSheet.create({
});