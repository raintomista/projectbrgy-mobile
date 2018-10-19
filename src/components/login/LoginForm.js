import validatorjs from 'validatorjs';
import MobxReactForm from 'mobx-react-form';

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
        console.log(form.values())
      },
      onError(form) {

      }
    }
  }
}