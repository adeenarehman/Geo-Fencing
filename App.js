import React, { Component } from 'react';
import MapView, {Circle} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      showsUserLocation: true,
      error: null
    }
  }

  componentDidMount() {
    Geolocation.watchPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        });
      },

      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 60000, maximumAge: 1000 },
    )
  }

  render() {
    console.log(this.state)
    return (
      <View style={styles.container}>

        {this.state.latitude && this.state.longitude &&
          <MapView style={styles.map}
            showsUserLocation={this.state.showsUserLocation}
            showsMyLocationButton={true}
            initialRegion={{
              latitude: 24.861725,
              longitude: 67.073378,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
          <Circle
            center={{ latitude: 24.861725, longitude: 67.073378 }}
            radius={200}
            fillColor={'rgba(255,0,0,0.3)'}
            strokeColor={'rgba(255,0,0,0.3)'}
          />

          <Circle
            center={{ latitude: 24.861725, longitude: 67.073378 }}
            radius={30}
            fillColor={'rgba(106, 90, 205, 0.2)'}
            strokeColor={'rgba(106, 90, 205, 0.2)'}
          />
          </MapView>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create
  ({
    container:
    {
      flex: 1
    },

    map:
    {
      position: 'absolute',
      height: '100%',
      width: '100%'
    }
  })

export default Map