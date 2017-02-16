import Exponent from 'exponent';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  StatusBar,
} from 'react-native';

class App extends React.Component {
  state = {
    liveStream: null,
    loaded: false,
    position: 0,
    error: null,
  }

  componentDidMount() {
    Exponent.Audio.setIsEnabled(true);

    const liveStream = new Exponent.Audio.Sound({
      source: 'http://96.31.83.87:8137/;',
    });

    liveStream.loadAsync().then(() => {
      this.setState({ loaded: true, error: null });
    }).catch(() => {
      this.setState({ error: 'Loading Failed' });
    });

    this.setState({
      liveStream,
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Image
          source={ require('./SPSeal.png') }
          resizeMode="contain"
          style={{ height: 150, width: 150 }}
        />
        <View
          style={ styles.buttonContainer }
        >
          <Button
            title="Start liveStream"
            color="#FFAB00"
            onPress={ () => {
              if (this.state.liveStream.isLoaded()) this.state.liveStream.play().then(status => {
                console.log(status);
                this.setState({ error: null, isPlaying: status.is_playing });
                setInterval(() => {
                  this.state.liveStream.getStatus().then(status => {
                    this.setState({ position: Math.round(status.position_millis / 1000) });
                  });
                }, 10);
              }).catch(err => this.setState({ error: err.toString() }));
            } }
          />
          <Button
            title="Pause liveStream"
            color="#FFAB00"
            onPress={ () => {
              if (this.state.liveStream.isLoaded()) this.state.liveStream.pause().then(status => {
                console.log(status);
                this.setState({ error: null, isPlaying: status.is_playing });
              }).catch(err => this.setState({ error: err.toString() }));
            } }
          />
        </View>
        <Text style={{ color: '#F50057' }}>{this.state.error}</Text>
        <Text style={{ color: '#fff' }}>Time elapsed: {this.state.position}s</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06195E',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 100,
  },
});

Exponent.registerRootComponent(App);
