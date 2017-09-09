import Expo from 'expo';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

export default class App extends React.Component {
  state = {
    imageUri: null,
    label: null,
  }

  render() {
    let imageView = null;
    if (this.state.imageUri) {
      imageView = (
        <Image
          style={{ width: 300, height: 300 }}
          source={{ uri: this.state.imageUri }}
        />
      );
    }

    let labelView = null;
    if (this.state.label) {
      labelView = (
        <Text style={{ margin: 5 }}>
          {this.state.label}
        </Text>
      );
    }

    return (
      <View style={styles.container}>
        {imageView}
        {labelView}
        <TouchableOpacity
          style={{ margin: 5, padding: 5, backgroundColor: '#ddd' }}
          onPress={this._pickImage}>
          <Text>take a picture!</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _pickImage = async () => {
    const {
      cancelled,
      uri,
      base64,
    } = await Expo.ImagePicker.launchCameraAsync({
      base64: true,
    });
    if (!cancelled) {
      this.setState({
        imageUri: uri,
        label: '(loading...)',
      });
    }

    const body = {
      requests:[
        {
          image:{
            content: base64,
          },
          features:[
            {
              type: 'LABEL_DETECTION',
              maxResults: 1,
            }
          ]
        },
      ],
    };

    const key = '<YOUR_API_KEY_HERE>';
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${key}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const parsed = await response.json();
    this.setState({
      label: parsed.responses[0].labelAnnotations[0].description,
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
