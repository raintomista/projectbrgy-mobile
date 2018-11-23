import validatorjs from 'validatorjs';
import MobxReactForm from 'mobx-react-form';
import {
  Alert,
  AsyncStorage,
  ToastAndroid
} from 'react-native';
import { createUser } from 'services/AuthService';
import NavigationService from 'services/NavigationService';


import en from 'validatorjs/src/lang/en';
import * as localized from 'localization/en';


validatorjs.setMessages('en', en);

export default class SignupForm extends MobxReactForm {
  setup() {
    const fields = {
      barangay_id: {
        rules: 'required|string'
      },
      first_name: {
        rules: 'required|string'
      },
      middle_name: {
        rules: 'string'
      },
      last_name: {
        rules: 'required|string'
      },
      email: {
        rules: 'required|email'
      },
      username: {
        rules: 'required|string'
      },
      password: {
        rules: 'required|string|min:8',
        placeholder: 'Must be at least 8 characters'
      },
      mobile_number: {
        rules: 'string',
      },
      landline_number: {
        rules: 'string'
      },
      role: {
        rules: 'string',
        value: 'barangay_member'
      },
    }

    return {
      fields
    };
  }

  plugins() {
    return {
      dvr: validatorjs
    };
  }

  hooks() {
    return {
      async onSuccess(form) {
        try {
          const response = await createUser(form.values());
          ToastAndroid.show('You have successfully created an account. Please check your email in order to activate your account.', ToastAndroid.LONG);
          NavigationService.pop();
        } catch(e) {
          if(e.response.data.errors[0].code === 'INVALID_EMAIL') {
            ToastAndroid.show('The provided email/username is already in use. Please provide another email/username.', ToastAndroid.LONG);
          } else {
            ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
          }
        }
      },
      onError(form) {
        const errors = form.errors();
        if(errors.email) {
          ToastAndroid.show('Please provide a valid email address', ToastAndroid.SHORT);
        } else if(errors.password) {
          ToastAndroid.show('Password must be at least 8 characters long', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('Please fill in all the required fields', ToastAndroid.SHORT);
        }
      }
    }
  }
}