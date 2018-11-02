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
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

@observer
export default class BarangayInformation extends Component {
  render() {
    const { brgyData } = RootStore.brgyPageStore;
    return (
      <Container>
        <HeaderWithGoBack 
          title="Barangay Details" 
          navigation={this.props.navigation} 
        />
        <View style={styles.view}>
          <BarangayDetails
            email={brgyData.email}
            landline={brgyData.landline_number}
            website={brgyData.website}
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