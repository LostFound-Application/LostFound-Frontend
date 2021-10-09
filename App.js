import React, {useState, useEffect} from 'react';
import {Button} from 'react-native-elements';
import Map from './components/Map';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {sendYourLocationData, updateMe} from './services/locationDataService';
import dgram from 'react-native-udp';
import Geolocation from 'react-native-geolocation-service';
import {getUniqueId} from 'react-native-device-info';

export default function App() {
  const [location, setLocation] = useState({
    latitude: '',
    longitude: '',
  });
  const [locationList, setLocationList] = useState([]);

  let uniqueId = getUniqueId();
  const okMessage = 'OK';

  const socket = dgram.createSocket('udp4');
  socket.bind(12345);

  socket.on('error', err => {
    console.log(`server error:\n${err.stack}`);
  });

  socket.on('message', function (msg, rinfo) {
    const serverPort = rinfo.port;
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    socket.send(
      okMessage,
      0,
      okMessage.length,
      serverPort,
      '10.0.2.2',
      function (err) {
        if (err) {
          throw err;
        }

        console.log('OK Message sent!');
      },
    );
  });

  const timerId = setInterval(() => {
    updateMe(socket, setLocationList);
    console.log('test', locationList);
  }, 10000);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({
          latitude,
          longitude,
        });
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Map location={location} locationList={locationList} />
        <Button
          title="Report Myself Lost"
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          raised
          onPress={() => sendYourLocationData(socket, uniqueId, location)}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'red',
  },
  buttonContainer: {
    bottom: 40,
    position: 'absolute',
  },
});
