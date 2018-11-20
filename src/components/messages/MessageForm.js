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
        extra: null
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
      onSuccess(form) {
        const { receiver_id, message } = form.values();
        this.$('message').set('value', '');      
        sendMessage(message, receiver_id)
          .then((response) => { 
            RootStore.conversationStore.addMessage(response.data.data);
            RootStore.inboxStore.sendMessage(response.data.data);
            this.$('message').extra.scrollToOffset({ animated: true, offset: 0});  
          })
          .catch((error) => {
            this.$('message').set('value', message);   
            ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
          });
      }
    }
  }
}