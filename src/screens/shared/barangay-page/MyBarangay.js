import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { 
  ScrollView,
  StyleSheet,
  View 
} from 'react-native';
import { 
  Container, 
  Content, 
  Spinner, 
} from 'native-base';
import { HeaderWithDrawer } from 'components/common';
import { 
  BarangayPageCard,
  FeedTabs
} from 'components/barangay-page';
import NavigationService from 'services/NavigationService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

@observer
export default class MyBarangay extends Component {
  async componentWillMount(){
    const { sessionStore, profileStore } = RootStore;
    await sessionStore.getLoggedUser();
    // await profileStore.setProfileId(sessionStore.loggedUser.user_id);
    // await profileStore.getProfileData();
  }

  async componentWillUnmount() {
    const { profileStore } = RootStore;
    // await profileStore.resetStore();
    // await profileStore.resetProfile();
  }
  
  render() {
    return (
      <Container>
        <HeaderWithDrawer 
          title="My Barangay" 
          navigation={this.props.navigation} 
        />
        <View style={styles.view}>
          <ScrollView>
            <BarangayPageCard
            />
            <FeedTabs />
          </ScrollView>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: colors.BACKGROUND
  },
});