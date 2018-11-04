import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { 
  AsyncStorage,
  ScrollView,
  StyleSheet,
  View 
} from 'react-native';
import { 
  Container, 
  Content, 
  Spinner, 
} from 'native-base';
import { HeaderWithGoBack } from 'components/common';
import { 
  BarangayPageCard,
  FeedTabs
} from 'components/barangay-page';
import NavigationService from 'services/NavigationService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

@observer
export default class BarangayPage extends Component {
  async componentWillMount(){
    const { brgyPageStore, sessionStore } = RootStore;
    await sessionStore.getLoggedUser();
    await brgyPageStore.getBrgyData();
    NavigationService.getActiveScreen();
  }

  async componentWillUnmount() {
    const { brgyPageStore } = RootStore;
    await brgyPageStore.resetStore();
    await brgyPageStore.resetPage();
  }
  
  render() {
    const { brgyData } = RootStore.brgyPageStore;
    
    return (
      <Container>
        <HeaderWithGoBack 
          title={brgyData ? brgyData.name : ''} 
          navigation={this.props.navigation} 
        />

        {!brgyData && (
          <Spinner color={colors.PRIMARY} />
        )}

        {brgyData && (
          <View style={styles.view}>
            <ScrollView>
              <BarangayPageCard
                name={brgyData.name}
                municipality={brgyData.municipality}
                followingCount={brgyData.stats.following_count}
                followersCount={brgyData.stats.followers_count}
                email={brgyData.email}
                landline={brgyData.landline_number}
                website={brgyData.website}
                isFollowing={brgyData.is_following}
              />
              <FeedTabs />
            </ScrollView>
          </View>
        )}
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