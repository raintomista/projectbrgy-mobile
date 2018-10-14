import React, {
  Component
} from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';

export default class SignIn extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Button
          block
        >
          <Text>Test</Text>
        </Button>
      </View>
    );
  }
}