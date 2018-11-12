import React from 'react';
import { observer } from 'mobx-react';
import { Linking, StyleSheet, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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


export const BarangayReportItem = observer((props) => {
  let icon = 'circle';
  let iconColor = '#808080'
  let status = 'unread';

  if(props.status === 'read') {
    icon = 'dot-circle'
    status = 'read';
  } else if(props.status === 'responded') {
    icon = 'dot-circle'
    iconColor = '#18976d';
    status = 'responded';
  }

  return (
    <TouchableNativeFeedback 
      onPress={props.handlePress}
    >
      <Card style={[styles.card, props.index === 0 && styles.cardFirstChild]}>
        <CardItem>
          <Body>
          <Text style={styles.cardTitle}>
            {capitalize(props.reportType)} Report
          </Text>

          {props.committeeType 
            ? <Text note numberOfLines={1}>{capitalize(props.committeeType)} &middot; by {props.author} &middot; {formatDate(props.dateCreated)}</Text>  
            : <Text note numberOfLines={1}>by {props.author} &middot; {formatDate(props.dateCreated)}</Text>   
          }      
          </Body>              
        </CardItem>
        <CardItem style={styles.cardBody}>
          <Body>
            <Text note numberOfLines={1}>{props.message}</Text>
          </Body>
        </CardItem>
        {props.status && (
          <CardItem style={{justifyContent: 'flex-end', alignItems: 'center', paddingTop: 0}}>
            <FontAwesome5 
              name={icon} 
              color={iconColor} 
              size={9} 
              solid
            />
            <Text uppercase={true} style={styles.reportStatusText}>
              {status}
            </Text>
          </CardItem>
        )}
      </Card>
    </TouchableNativeFeedback>
  );
});

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
      <Text style={styles.responseHeaderTitle} numberOfLines={1}>{props.sender}</Text>
      <Text note style={styles.responseHeaderDetailsLeft} numberOfLines={1}>
        to {props.receiver}
      </Text>      
      <Text>&nbsp;</Text>
    </Content>  
    <Content contentContainerStyle={styles.responseHeaderRight}>
      <Text note style={styles.responseHeaderDetailsRight}>
        {props.dateCreated}
      </Text>
      <Text note style={styles.responseHeaderDetailsRight}>
        {props.timeCreated}
      </Text>
      <Badge style={styles.responseHeaderBadge}>
        <Text style={styles.responseHeaderBadgeText}>
          #{props.index+1}
        </Text>
      </Badge>
    </Content>  
  </View>
));

export const ReportResponseContent = observer((props) => (
  <View style={styles.responseContent}>
    <Text note style={styles.responseContentMessage}>
      {props.message}
    </Text>

    {props.attachments.length > 0 && (
      <React.Fragment>
        <Text style={styles.responseContentAttachmentsLabel}>
          {props.attachments.length}
          {props.attachments.length > 1 ? ' attachments' : ' attachment'} 
        </Text>
        {props.attachments.map((attachment) => (
          <TouchableOpacity onPress={() => Linking.openURL(attachment.link)} key={attachment.id}>
            <Text style={styles.responseContentAttachmentName}>
              {attachment.filename}
            </Text>
          </TouchableOpacity>
        ))}
      </React.Fragment>
    )}
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
    marginTop: 2
  },
  responseHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  responseHeaderTitle: {
    fontFamily: fonts.LATO_BOLD,    
    fontSize: 14.5
  },
  responseHeaderDetailsLeft: {
    color: '#808080',   
    fontFamily: fonts.LATO_REGULAR,    
    fontSize: 13.5
  },
  responseHeaderDetailsRight: {
    color: '#808080',
    textAlign: 'right',
    fontFamily: fonts.LATO_REGULAR,    
    fontSize: 13.5
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
    fontFamily: fonts.LATO_REGULAR, 
    fontSize: 14,
    marginTop: 4
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
  },
  reportStatusText: {
    color: '#808080',
    fontFamily: fonts.LATO_REGULAR,    
    fontSize: 12,
    marginLeft: 5
  }
});