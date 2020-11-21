import React, { Component } from 'react';
import MapView, { Marker, Circle } from 'react-native-maps';
//import Location_icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Location_icon from 'react-native-vector-icons/FontAwesome5';
// import firestore from '@react-native-firebase/firestore';
import BackgroundGeolocation, { createGeofenceMarker, onGeofencesChange } from "react-native-background-geolocation";


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
      latitude: 24.8618,
      longitude: 67.0735,
      showsUserLocation: true,
      error: null,
      zones: [],
      // lat: 24.8618,
      // lng: 67.0735, 
    }
  }


  componentDidMount = () => {
    this.getUser();
    this.onResume();
    // this.addGeofence();
    this.createCircle();
  }

  getUser = async () => {
    let location = await BackgroundGeolocation
      .getCurrentPosition({
        timeout: 30,          // 30 second timeout to fetch location
        maximumAge: 5000,     // Accept the last-known-location if not older than 5000 ms.
        desiredAccuracy: 10,  // Try to fetch a location with an accuracy of `10` meters.
        samples: 3,           // How many location samples to attempt.
        // extras: {             // Custom meta-data.
        //   "route_id": 123
        // }
      });

    console.log("latitude= ", location.coords.latitude);
    console.log("longitude= ", location.coords.longitude);
  }

  onResume() {
    // Start watching position while app in foreground.
    BackgroundGeolocation.watchPosition((location) => {
      console.log("[watchPosition] -", location);
    }, (errorCode) => {
      console.log("[watchPosition] ERROR -", errorCode);
    }, {
      interval: 60000
    })
  }

  // addGeofence() {
  //   BackgroundGeolocation.addGeofence({
  //     identifier: "Home",
  //     radius: 900,
  //     latitude: this.state.latitude,
  //     longitude: this.state.longitude,
  //     notifyOnEntry: true,
  //     notifyOnExit: true,
  //   })
  //     .then((success) => {
  //       console.log("[addGeofence] success");

  //     })
  //     .catch((error) => {
  //       console.log("[addGeofence] FAILURE: ", error);
  //     });
  // }

  createCircle() {
    // Listen to geofence events
    BackgroundGeolocation.onGeofence(geofence => {
      console.log("[geofence] ", geofence);
      if (geofence.identifier == "DANGER_ZONE") {
        if (geofence.action == "ENTER") {
          // Entering the danger-zone, we want to aggressively track location.
          BackgroundGeolocation.start();
        } else if (geofence.action == "EXIT") {
          // Exiting the danger-zone, we resume geofences-only tracking.
          BackgroundGeolocation.startGeofences();
        }
      }
    })

    // Add a geofence.
    BackgroundGeolocation.addGeofence({
      identifier: "DANGER_ZONE",
      radius: 1000,
      latitude: this.state.lat,
      longitude:  this.state.lng,
      notifyOnEntry: true,
      notifyOnExit: true,
    })

    // Ready the plugin.
    BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      url: "http://your.server.com/locations",
      autoSync: true
    }, state => {
      BackgroundGeolocation.startGeofences();
    })
  }



  render() {
    return (
      <View style={styles.container}>

        {this.state.latitude && this.state.longitude &&
          <MapView style={styles.map}
            showsUserLocation={this.state.showsUserLocation}
            showsMyLocationButton={true}
            initialRegion={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
          </MapView>}
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