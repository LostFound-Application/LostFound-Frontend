import React, {useState, useEffect} from 'react';
import {Button} from 'react-native-elements';
import Map from './components/Map';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {
  reportMyselfAsFound,
  sendYourLocationData,
  updateMe,
} from './services/locationDataService';
import dgram from 'react-native-udp';
import Geolocation from 'react-native-geolocation-service';

export default function App() {
  const [location, setLocation] = useState({
    latitude: '',
    longitude: '',
  });
  const [locationList, setLocationList] = useState([]);

  const socket = dgram.createSocket('udp4');
  socket.bind(12345);

  socket.on('error', err => {
    console.log(`server error:\n${err.stack}`);
  });

  const okMessage = 'OK';

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
        updateMe(setLocationList);
      },
    );
  });

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
        <Map
          location={location}
          setLocationList={setLocationList}
          locationList={locationList}
        />
        <Button
          title="Report Myself as Lost"
          containerStyle={styles.buttonContainerLost}
          buttonStyle={styles.buttonLost}
          raised
          onPress={() =>
            sendYourLocationData(socket, location, setLocationList)
          }
        />
        <Button
          title="Report Myself as Found"
          containerStyle={styles.buttonContainerFound}
          buttonStyle={styles.button}
          raised
          onPress={() => reportMyselfAsFound(socket, setLocationList)}
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
  buttonLost: {
    backgroundColor: 'red',
  },
  buttonContainerLost: {
    bottom: 70,
    position: 'absolute',
  },
  buttonContainerFound: {
    bottom: 20,
    position: 'absolute',
  },
});
