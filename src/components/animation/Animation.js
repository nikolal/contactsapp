import React from 'react';
import { Animated } from 'react-native';


export class FadeInOut extends React.Component {

  state = {
    fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
  }

  componentDidMount() {
    Animated.sequence([
      Animated.timing(
        this.state.fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        }
      ),
      Animated.timing(
        this.state.fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true
        }
      )
    ]).start();
  }

  render() {
    const { fadeAnim } = this.state;
    return (
      <Animated.View
        style={{
          ...this.props.style,
          opacity: fadeAnim,
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
