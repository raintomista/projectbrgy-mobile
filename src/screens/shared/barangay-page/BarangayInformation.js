import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { 
  Dimensions,
  StyleSheet, 
  View 
} from 'react-native';
import { Container } from 'native-base';
import { HeaderWithGoBack } from 'components/common';
import { BarangayDetails } from 'components/barangay-page';
import NavigationService from 'services/NavigationService';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';
import { observable, action } from 'mobx';

@observer
export default class BarangayInformation extends Component {
  @observable brgyInfo = null;

  @action
  setBrgyInfo(brgyInfo) {
    this.brgyInfo = brgyInfo;
  }

  componentWillMount() {
    this.setBrgyInfo(NavigationService.getActiveScreenParams());
  }

  render() {
    return (
      <Container>
        <HeaderWithGoBack 
          title="Barangay Details" 
          navigation={this.props.navigation} 
        />
        <View style={styles.view}>
          <BarangayDetails
            email={this.brgyInfo.email}
            landline={this.brgyInfo.landline}
            website={this.brgyInfo.website}
          />
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: colors.BACKGROUND,
    minHeight: Dimensions.get('window').height - 56,     
  }
});