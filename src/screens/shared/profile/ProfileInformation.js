import React, { Component } from 'react';
import { 
  observer 
} from 'mobx-react';
import { 
  Dimensions,
  StyleSheet, 
  View 
} from 'react-native';
import { 
  Container, 
} from 'native-base';
import { 
  HeaderWithGoBack 
} from 'components/common';
import { 
  BarangayInformationCard,
  ContactInformationCard 
} from 'components/profile';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

@observer
export default class ProfileInformation extends Component {
  render() {
    const { profileData } = RootStore.profileStore;
    console.log(profileData);
    return (
      <Container>
        <HeaderWithGoBack 
          title="Profile Details" 
          navigation={this.props.navigation} 
        />
        <View style={styles.view}>
          <BarangayInformationCard
            region={profileData.barangay_page_region}
            province={profileData.barangay_page_province}
            municipality={profileData.barangay_page_municipality}
            barangay={profileData.barangay_page_name}
            barangayCaptain={profileData.barangay_page_captain}
            barangayAddress={profileData.barangay_page_office_address_street}
          />
          <ContactInformationCard
            email={profileData.user_email}
            mobile={profileData.user_mobile_number}
            landline={profileData.user_landline_number}
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