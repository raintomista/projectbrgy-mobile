import validatorjs from 'validatorjs';
import en from 'validatorjs/src/lang/en';
import MobxReactForm from 'mobx-react-form';
import {
  Alert,
  AsyncStorage,
  ToastAndroid
} from 'react-native';
import { StackActions } from 'react-navigation';
import NavigationService from 'services/NavigationService';
import { createReport } from 'services/ReportService';
import RootStore from 'stores/RootStore';
import * as localized from 'localization/en';

export default class CreateReportForm extends MobxReactForm {
  constructor() {
    super();
    this.$('committee_type').set('disabled', true);
  }
  setup() {
    const fields = {
      receiver_id: {
        rules: 'string'
      },
      report_type: {
        rules: 'required',
        value: 'General',
        handlers: {
          onChange: (field) => (value) => {
            const bool = value === 'Committee' ? false : true;
            this.$('committee_type').set('disabled', bool);
            field.set('value', value)
          }
        }
      },
      committee_type: {
        rules: 'required_if:report_type,Committee',
        value: 'Complaint',
      }, 
      message: {
        rules: 'required|between:1,150',
      }
    }

    return {
      fields
    };
  }

  plugins() {
    return {
      dvr: validatorjs.setMessages('en', en)
    };
  }

  hooks() {
    return {
      async onSuccess(form) {
        Alert.alert(
          'Create Report',
          'Are you sure you want to create this report?',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'OK', onPress: async () => {
              const { reportStore, sessionStore } = RootStore;
              const { loggedUser } = sessionStore; 
       
              form.$('receiver_id').set('value', loggedUser.barangay_page_id);
      
              // Disable fields on submit
              form.$('report_type').set('disabled', true);
              form.$('committee_type').set('disabled', true);        
              form.$('message').set('disabled', true);
      
              let {
                message,
                receiver_id,
                report_type,
                committee_type,
              } = form.values();
              committee_type = report_type === 'General' ? null : committee_type.toLowerCase();
              report_type = report_type.toLowerCase();
              let files = [];
      
              try {
                // Set form data
                let formData = new FormData();
                formData.append('message', message);
                formData.append('receiver_id', receiver_id);
                formData.append('report_type', report_type);
                formData.append('committee_type', committee_type);
                formData.append('files', '');
      
                await createReport(formData); //Http request for creating new 
                this.clear(); // Clear form when the request is successful
                NavigationService.dispatch(StackActions.pop()); //Go back to the previous screen
                ToastAndroid.show(localized.CREATE_REPORT_SUCCESS, ToastAndroid.SHORT);
                reportStore.refreshMyReports();
              } catch(e) {
                // Enable fields on error
                form.$('report_type').set('disabled', false);
                form.$('committee_type').set('disabled', false);        
                form.$('message').set('disabled', false);
      
                // Display error message
                ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
              }
            }},
          ],
          { cancelable: false }
        );
      },
      onError(form) {
        ToastAndroid.show(localized.FIELDS_REQUIRED, ToastAndroid.SHORT);
      }
    }
  }
}