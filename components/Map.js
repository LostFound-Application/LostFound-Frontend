import React, {useState, useEffect} from 'react';
import MapView, {Circle, Marker} from 'react-native-maps';
import {StyleSheet, Dimensions, View} from 'react-native';
import {updateMe} from '../services/locationDataService';

const Map = props => {
  useEffect(() => {
    updateMe(props.setLocationList);
    const interval = setInterval(() => {
      updateMe(props.setLocationList);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MapView
      style={styles.map}
      mapType={'hybrid'}
      showsUserLocation={true}
      initialRegion={{
        latitude: props.location.latitude,
        longitude: props.location.longitude,
        latitudeDelta: 12.22,
        longitudeDelta: 12.22,
      }}
      followsUserLocation={true}
      showsMyLocationButton={true}>
      {props.locationList.length > 0 && (
        <View>
          {props.locationList.map((marker, index) => (
            <Marker
              key={index}
              title={marker[0].toString() + ', ' + marker[1].toString()}
              coordinate={{
                latitude: marker[0],
                longitude: marker[1],
              }}
            />
          ))}
          {props.locationList.map((marker, index) => (
            <Circle
              key={index}
              strokeColor={'red'}
              strokeWidth={8}
              radius={500}
              center={{
                latitude: marker[0],
                longitude: marker[1],
              }}
            />
          ))}
        </View>
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default Map;
