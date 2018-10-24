import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { 
  Button,  
  Container, 
  Content,
  Item,
  Label,
  Input,
  Form,
  Spinner,
  Text
} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { responsiveHeight } from 'react-native-cross-platform-responsive-dimensions'
import { HeaderWithGoBack } from 'components/common';
import { 
  DropdownMenu, 
  ReportItem,
  TextArea
} from 'components/member-reports';
import CreateReportForm from 'components/member-reports/CreateReportForm'
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts.js'

@observer
export default class MemberCreateReport extends Component {
  constructor(props) {
    super(props);
    this.form = new CreateReportForm();
  }

  render() {
    return (
      <Container>
        <HeaderWithGoBack title="Create Report" />
        <Content padder contentContainerStyle={{ flexGrow: 1 }}>
          {this.form.$('message').disabled && (
              <View style={styles.loading}>
                <Spinner color={colors.PRIMARY} />
              </View>
          )}
          <Form style={{flex: 1}}>
            <DropdownMenu
              label="Report Type"
              data={['General', 'Committee']} 
              field={this.form.$('report_type')}
            />
            <DropdownMenu
              label="Committee Type"
              data={['Complaint', 'Inquiry', 'Feedback']} 
              field={this.form.$('committee_type')}
            />
            <TextArea
              rowSpan={5}
              placeholder="Write your detailed report here..." 
              field={this.form.$('message')}
            />
            <Button 
              bordered
              rounded   
              style={styles.button}
              onPress={(e) => this.form.onSubmit(e)}
              disabled={this.form.$('message').value.length === 0 || this.form.$('message').value.length > 150 || this.form.$('message').disabled}
            >
              <Text 
                style={styles.buttonText} 
                uppercase={false}
              >
                Submit
              </Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    padding: 12
  },
  loading: {
    backgroundColor: 'rgba(220, 220, 220, 0.7)',
    justifyContent: 'center',        
    alignItems: 'center',
    position: 'absolute',    
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 2
  },
  button: {
    alignSelf: 'center',
    borderColor: colors.PRIMARY,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    paddingHorizontal: 10
  },
  buttonText: {
    color: colors.PRIMARY,                  
    fontFamily: fonts.LATO_BOLD,
    fontSize: 17
  }
});