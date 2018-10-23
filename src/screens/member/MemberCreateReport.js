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
import { HeaderWithGoBack } from 'components/common';
import { 
  DropdownMenu, 
  ReportItem,
  TextArea
} from 'components/member-reports';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts.js'

@observer
export default class MemberCreateReport extends Component {
  render() {
    return (
      <Container>
        <HeaderWithGoBack title="Create Report" />
        <Content padder>
          <Form>
            <DropdownMenu
              label="Report Type"
              data={['General', 'Committee']} 
            />
            <DropdownMenu
              label="Committee Type"
              data={['Complaint', 'Inquiry', 'Feedback']} 
            />
            <TextArea
              rowSpan={5}
              placeholder="Write your detailed report here..." 
            />
            <Button 
              bordered
              rounded   
              style={styles.button}      
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
  fab: {
    backgroundColor: colors.PRIMARY
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