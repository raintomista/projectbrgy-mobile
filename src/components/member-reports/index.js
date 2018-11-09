import React from 'react';
import { observer } from 'mobx-react';
import { StyleSheet, TouchableNativeFeedback } from 'react-native';
import {
    Accordion,
    Badge,
    Body,
    Card,
    CardItem,
    Container, 
    Content,
    Item,
    Label,
    Left,
    Picker,
    Right,
    Spinner,
    Text,
    Textarea,
    View,
  } from 'native-base';
import moment from 'moment';
import NavigationService from 'services/NavigationService';
import RootStore from 'stores/RootStore';
import * as colors from 'styles/colors';
import * as fonts from 'styles/fonts';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(date) {
  return moment(date).format('MMMM DD, YYYY hh:mm:ss a')
}

export const ReportItem = observer((props) => (
  <Card style={[styles.card, props.index === 0 && styles.cardFirstChild]}>
    <CardItem>
      <Body>
      <Text style={styles.cardTitle}>
        {capitalize(props.reportType)} Report
      </Text>
      {props.committeeType 
        ? <Text note>{capitalize(props.committeeType)} &middot; {formatDate(props.dateCreated)}</Text>  
        : <Text note>{formatDate(props.dateCreated)}</Text>     
      }     
      </Body>              
    </CardItem>
    <CardItem style={styles.cardBody}>
      <Body>
        <Text note numberOfLines={1}>{props.message}</Text>
      </Body>
    </CardItem>
  </Card>
));

export const RespondedReportItem = observer((props) => (
  <TouchableNativeFeedback 
    onPress={async () => {
      NavigationService.push('MyReportOverview', { reportId: props.reportId });
      await RootStore.reportStore.setReportId(props.reportId);
    }}
  >
    <Card style={[styles.card, props.index === 0 && styles.cardFirstChild]}>
      <CardItem>
        <Body>
        <Text style={styles.cardTitle}>
          {capitalize(props.reportType)} Report
        </Text>
        <Text note numberOfLines={1}>Responded at {formatDate(props.dateUpdated)}</Text>     
        </Body>              
      </CardItem>
      <CardItem style={styles.cardBody}>
        <Body>
          <Text note numberOfLines={1}>{props.message}</Text>
        </Body>
      </CardItem>
    </Card>
  </TouchableNativeFeedback>
));

export const ReportOverviewItem = observer((props) => (
  <Card style={[styles.card, {marginTop: 12, marginBottom: 12}]}>
    <CardItem>
      <Body>
        <Text style={styles.cardTitle}>
          {capitalize(props.reportType)} Report
        </Text>
        {props.committeeType 
          ? <Text note>{capitalize(props.committeeType)} &middot; {formatDate(props.dateCreated)}</Text>  
          : <Text note>{formatDate(props.dateCreated)}</Text>     
        }     
      </Body>              
    </CardItem>
    <CardItem style={styles.cardBody}>
      <Body>
        <Text note style={{marginRight: 0}}>
          {props.message}
        </Text>
      </Body>
    </CardItem>
  </Card>
))

export const ReportResponseHeader = observer((props) => (
  <View style={styles.responseHeader}>
    <Content>
      <Text style={styles.responseHeaderTitle}>Barangay 1</Text>
      <Text note style={styles.responseHeaderDetailsLeft}>
        to me
      </Text>      
      <Text>&nbsp;</Text>
    </Content>  
    <Content contentContainerStyle={styles.responseHeaderRight}>
      <Text note style={styles.responseHeaderDetailsRight}>
        Oct 24, 2018
      </Text>
      <Text note style={styles.responseHeaderDetailsRight}>
        11:26:52 PM
      </Text>
      <Badge style={styles.responseHeaderBadge}>
        <Text style={styles.responseHeaderBadgeText}>
          #2
        </Text>
      </Badge>
    </Content>  
  </View>
));

export const ReportResponseContent = observer((props) => (
  <View style={styles.responseContent}>
    <Text note style={styles.responseContentMessage}>
      dahdahd hajhdfahdj hdjahdha hdajhdjah jdhajdhajhda
    </Text>
    <Text style={styles.responseContentAttachmentsLabel}>
      4 attachments:
    </Text>
    <Text style={styles.responseContentAttachmentName}>File 1 - Copy.png</Text>
    <Text style={styles.responseContentAttachmentName}>File 1 - Copy.png</Text>
    <Text style={styles.responseContentAttachmentName}>File 1 - Copy.png</Text>
    <Text style={styles.responseContentAttachmentName}>File 1 - Copy.png</Text>
  </View>
))

export const DropdownMenu = observer((props) => (
  <Item stackedLabel style={styles.dropdownItem}>
    <Label style={styles.dropdownLabel}>
      {props.label}
    </Label>
    {props.field && (
      <Item picker style={styles.dropdownMenu}>
        <Picker 
          mode="dropdown"
          enabled={!props.field.disabled}
          selectedValue={props.field.value}
          onValueChange={props.field.onChange}
        >
          {props.data.map((item, index) => (
            <Picker.Item
              key={index}
              label={item}
              value={item} 
            />
          ))}
        </Picker>
      </Item>
    )}
  </Item>
));

export const TextArea = observer((props) => (
  <React.Fragment>
    <Textarea 
      onChangeText={(value) => props.field.set('value', value)}
      rowSpan={props.rowSpan} 
      placeholder={props.placeholder}
      disabled={props.field.disabled}
      style={[styles.textArea, props.field.value.length > 150 && styles.textAreaError]}
      bordered      
    />
    <Text style={[styles.characterCount, props.field.value.length > 150 && styles.characterCountError]}>
      {150 - props.field.value.length}
    </Text>
  </React.Fragment>
));

const styles = StyleSheet.create({
  card: {
    borderRadius: 0,
    marginTop: 0,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 15,
  },
  cardFirstChild: {
    marginTop: 15,
  },
  cardLastChild: {
    marginBottom: 12
  },
  cardTitle: {
    color: colors.PRIMARY,
    fontFamily: fonts.MONTSERRAT_BOLD,
    fontSize: 18,
  },
  cardBody: {
    paddingTop: 0,
    paddingBottom: 14
  },
  characterCount: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_BOLD,
    marginHorizontal: 7,
    marginBottom: 18,
    textAlign: 'right'
  },
  characterCountError: {
    color:'#fb8383'
  },
  dropdownItem: {
    borderBottomWidth: 0,
    marginLeft: 5,
    marginRight: 5
  },
  dropdownLabel: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_BOLD,
    fontSize: 17
  },
  dropdownMenu: {
    backgroundColor: colors.GRAY,
    borderBottomWidth: 0,
    marginTop: 10
  },
  responseContent: {
    flexDirection: 'column', 
    marginTop: 5
  },
  responseContentMessage: {
    fontFamily: fonts.LATO_REGULAR,   
  },
  responseHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  responseHeaderTitle: {
    fontFamily: fonts.LATO_REGULAR,    
    fontSize: 15
  },
  responseHeaderDetailsLeft: {
    color: '#808080',    
  },
  responseHeaderDetailsRight: {
    color: '#808080',
    textAlign: 'right'  
  },
  responseHeaderBadge: {
    alignSelf: 'flex-end',
    backgroundColor: colors.PRIMARY,
    borderRadius: 5,
    height: 20,
    marginTop: 3
  },
  responseHeaderBadgeText: {
    fontFamily: fonts.LATO_REGULAR, 
    fontSize: 12, 
    lineHeight: 18
  },
  responseContentMessage: {
    color: '#808080',
    marginTop: 8    
  },
  responseContentAttachmentsLabel: {
    color: '#727272',
    fontFamily: fonts.LATO_BOLD,
    fontSize: 14,
    marginTop: 10
  },
  responseContentAttachmentName: {
    color: colors.PRIMARY,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 14,
    marginLeft: 5,
    textDecorationLine: "underline"
  },
  textArea: {
    backgroundColor: colors.GRAY,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    fontFamily: fonts.LATO_REGULAR,
    fontSize: 16,
    marginTop: 18,
    marginBottom: 5,
    marginHorizontal: 5
  },
  textAreaError: {
    backgroundColor: '#fb8383',
  }
});