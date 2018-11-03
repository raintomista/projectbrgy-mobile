import React, { Component } from 'react';
import { 
  FlatList, 
  StyleSheet, 
  ToastAndroid,
  View
} from 'react-native';
import { 
  Container, 
  Header,
  Icon,
  Input,
  Item,
  Spinner
} from 'native-base';
import { 
  action,
  observable, 
  computed,
  runInAction
} from "mobx";
import { observer } from 'mobx-react';
import { FollowingListItem } from 'components/search';
import { search } from 'services/SearchService';

import * as localized from 'localization/en';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

@observer
export default class Search extends Component {
  @observable query;
  @observable results;
  @observable page;
  @observable limit;
  @observable order;
  @observable hasMore;
  @observable error;

  @action 
  initialize() {
    this.query = '';
    this.page = 0;
    this.limit = 20;
    this.order = 'desc';
    this.hasMore = false;
    this.error = false;
    this.results = [];
  }

  @action
  handleChangeText(value) {
    this.query = value;    
    this.searchPage();
  }

  @action
  async searchPage() {
    this.page = 1;
    this.hasMore = true;
    this.error = false;
    this.results = []
    
    try {
      const response = await search(this.query, this.page, this.limit);
      runInAction(() => {
        if(this.query !== '') {
          this.results = response.data.data.items;
        } else {
          this.results = [];
          this.hasMore = false;
        }
      });
    } catch(e) {
      runInAction(() => {
        this.hasMore = false;
        this.error = true;
      });
    }
  }

  @action
  async loadMore() {
    this.page += 1;
    try {
      const response = await search(this.query, this.page, this.limit);
      if(response.data.data.items.length > 0) {
        runInAction(() => {
          this.results.push(...response.data.data.items);
        });
      } else {
        runInAction(() => {
          this.hasMore = false;
          this.error = true;
        });
      }
    } catch(e) {
      runInAction(() => {
        this.hasMore = false;
        this.error = true;
      });
    }
  }

  componentWillMount() {
    this.initialize();
  }

  renderItem = ({item, index}) => (
    <FollowingListItem
      index={index}
      id={item.id}
      title={item.name}
      details={`${item.municipality}, ${item.province}, ${item.region}`}
    />
  );

  renderLoader(hasMore) {
    if(hasMore === false) return null;
    return <Spinner color={colors.PRIMARY}/>
  }

  handleLoadMore() {
    if(!this.error) {
      this.loadMore();
    }
  }

  renderList(results, hasMore) {
    return (
      <FlatList
        data={Array.from(results)}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
        ListFooterComponent={() => this.renderLoader(hasMore)}
        onEndReached={() => this.handleLoadMore()}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}    
      />
    )
  }

  render() {
    return (
      <Container>
        <Header style={styles.header} searchBar>
          <Item rounded style={styles.searchBar}>
            <Input 
              onChangeText={(value) => this.handleChangeText(value)}
              onSubmitEditing={(e) => this.searchPage()}
              placeholder="Search for barangay pages"              
              returnKeyLabel="Search"
              returnKeyType="search"
              style={styles.searchBarInput}
            />
            <Icon name="search" />            
          </Item>
        </Header>
        <View style={{ flex: 1 }}>
          {this.renderList(this.results, this.hasMore)}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.PRIMARY
  },
  searchBar: {
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingLeft: 10,
    paddingRight: 8
  },
  searchBarInput: {
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 16
  }
});