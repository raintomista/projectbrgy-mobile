import validatorjs from 'validatorjs';
import MobxReactForm from 'mobx-react-form';
import {
  Alert,
  AsyncStorage,
  ToastAndroid
} from 'react-native';
import { loginUser } from 'services/AuthService';
import NavigationService from 'services/NavigationService';



export default class LoginForm extends MobxReactForm {
  setup() {
    const fields = {
      email: {
        rules: 'string',
        placeholder: 'Email Address'
      },
      password: {
        rules: 'string',
        placeholder: 'Password'
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
        const {
          email,
          password
        } = form.values();
        this.$('email').set('disabled', true);
        this.$('password').set('disabled', true);

        try {
          const response = await loginUser(email, password);
          await AsyncStorage.setItem('x-access-token', response.data.data.token);
          await AsyncStorage.setItem('user-id', response.data.data.id);
          await AsyncStorage.setItem('user-role', response.data.data.role);          
          await AsyncStorage.setItem('brgy-id', response.data.data.barangay_id);
          
          // Disable Form
          this.$('email').set('disabled', false);
          this.$('password').set('disabled', false);

          if(response.data.data.role === 'barangay_member') {
            NavigationService.navigate('MemberDrawer', {})
          } else if (response.data.data.role === 'barangay_page_admin') {
            NavigationService.navigate('AdminDrawer', {})
          }
        } 
        catch (e) {
          const error = e.response.data.errors[0];
          if (error.code === 'LOG_FAIL' || error.code === 'INC_DATA') {
            ToastAndroid.show('The email or the password you’ve entered is incorrect.', ToastAndroid.SHORT);
          } else if (error.code === 'INVALID_ACTION') {
            ToastAndroid.show('Please check your email to activate your account.', ToastAndroid.SHORT);
          } else {
            ToastAndroid.show('An error occurred. Please try again.', ToastAndroid.SHORT);
          }

          // Re-enable Form
          this.$('email').set('disabled', false);
          this.$('password').set('disabled', false);
        }
      }
    }
  }
}