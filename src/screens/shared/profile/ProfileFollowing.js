import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Container, Content, List, Spinner } from 'native-base';
import HeaderWithDrawer from '../../../components/common/HeaderWithDrawer';
import ListItem from '../../../components/profile-following/ListItem';

@observer
export default class ProfileFollowing extends Component {
  async componentWillMount(){
    const { sessionStore, profileStore } = this.props.screenProps;
    await sessionStore.getLoggedUser();
    await profileStore.getFollowing(sessionStore.loggedUser.user_id);
  }
  render() {
    const { profileStore } = this.props.screenProps;
    const { followingList } = profileStore;
    let items;

    if(followingList) {
      items = followingList.map((item, index) => (
        <ListItem
          title={item.barangay_page_name}
          details={`${item.barangay_page_municipality}, ${item.barangay_page_province}, ${item.barangay_page_region}`}
          key={index}
        />
      ))
    }
    
    return (
      <Container>
        <HeaderWithDrawer title="Following" navigation={this.props.navigation}/>
        <Content>
          {!followingList && (
            <Spinner />
          )}
          {followingList && (
            <List>
              {items}
            </List>
          )}
        </Content>
      </Container>
    );
  }
}