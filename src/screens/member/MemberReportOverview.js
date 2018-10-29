import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { FlatList, RefreshControl, StyleSheet, ScrollView, View } from 'react-native';
import { 
  Accordion,
  Body,
  Card,
  CardItem,
  Container, 
  Content,
  Spinner,
} from 'native-base';
import { responsiveHeight } from 'react-native-cross-platform-responsive-dimensions'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { HeaderWithGoBack } from 'components/common';
import { 
  ReportOverviewItem, 
  ReportResponseHeader,
  ReportResponseContent
} from 'components/member-reports';
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

    renderHeader(item) {
      return (
        <ReportResponseHeader
        />
      )
    }

    renderContent(item) {
      return <ReportResponseContent />
    }

    renderResponseItem() {
      return (
        <Card style={styles.responseCard}>
          <CardItem>
            <Accordion
              dataArray={[{a: 1}]}
              renderHeader={this.renderHeader}
              renderContent={this.renderContent}
              style={{borderWidth: 0}}
            />
          </CardItem>
        </Card>
      )
    }

    render() {
      const { reportStore } = RootStore;
      const { report } = reportStore;
      
      return (
        <Container>
          <HeaderWithGoBack title="Overview" />
          <View>
            <ScrollView >
              {!report && <Spinner color={colors.PRIMARY} />}
              {report && (
                <ReportOverviewItem
                  dateCreated={report.inquiry_date_created}    
                  reportType={report.inquiry_report_type}
                  committeeType={report.inquiry_committee_type}
                  message={report.inquiry_message}
                />
              )}

              {this.renderResponseItem()}
              {this.renderResponseItem()}
              {this.renderResponseItem()}
            </ScrollView>
          </View>
        </Container>
      );
    }
}

const styles = StyleSheet.create({
  responseCard: {
    marginTop: 8,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 0
  }
});