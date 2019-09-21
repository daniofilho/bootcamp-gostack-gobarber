import React, { Component } from 'react';
import { LoadingView } from './styles';
import { ActivityIndicator, View } from 'react-native';

export default class Loading extends Component {
  render() {
    return (
      <LoadingView>
        <ActivityIndicator size="large" color="#7159c1" />
      </LoadingView>
    );
  }
}
