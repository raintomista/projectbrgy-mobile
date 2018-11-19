import validatorjs from 'validatorjs';
import MobxReactForm from 'mobx-react-form';
import { Alert, AsyncStorage, ToastAndroid } from 'react-native';
import { sendMessage } from 'services/MessagingService';
import RootStore from 'stores/RootStore';
import * as localized from 'localization/en';

export default class MessageForm extends MobxReactForm {
  setup() {
    const fields = {
      receiver_id: {
        rules: 'string'
      },
      message: {
        rules: 'string',
      }
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
        const { receiver_id, message } = form.values();
        try {
          const response = await sendMessage(message, receiver_id);
          RootStore.conversationStore.addMessage(response.data.data);
          this.$('message').set('value', '');        
        } catch(e) {  
          ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
        }
      }
    }
  }
}