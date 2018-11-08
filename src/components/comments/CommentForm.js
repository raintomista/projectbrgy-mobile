import validatorjs from 'validatorjs';
import MobxReactForm from 'mobx-react-form';
import {
  Alert,
  AsyncStorage,
  ToastAndroid
} from 'react-native';
import { addComment } from 'services/CommentService';
import * as localized from 'localization/en';

export default class CommentForm extends MobxReactForm {
  setup() {
    const fields = {
      postId: {
        rules: 'string'
      },
      commentMessage: {
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
        const { postId, commentMessage } = form.values();
        try {
          await addComment(postId, commentMessage);
          this.$('commentMessage').set('value', '');
          ToastAndroid.show(localized.COMMENT_ADD_SUCCESS, ToastAndroid.SHORT);          
        } catch(e) {  
          ToastAndroid.show(localized.REQUEST_ERROR, ToastAndroid.SHORT);
        }
      }
    }
  }
}