import React from 'react';
import MapView, {Marker} from 'react-native-maps';
import {StyleSheet, Dimensions} from 'react-native';

const Map = props => {
  console.log('plis', props.locationList);
  return (
    <MapView
      style={styles.map}
      showsUserLocation={true}
      followsUserLocation={true}
      showsMyLocationButton={true}>
      <Marker
        coordinate={{
          latitude: 37.78825,
          longitude: -122.4324,
        }}
      />
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
