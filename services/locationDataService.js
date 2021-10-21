import dgram from 'react-native-udp';
import {getUniqueId} from 'react-native-device-info';

export function sendYourLocationData(socket, location, setLocationList) {
  let uniqueId = getUniqueId();
  console.log('Message is being sent.');
  console.log('location', location);
  const message = `lost, ${uniqueId}, ${location.latitude}, ${location.longitude}`;
  socket.send(message, 0, message.length, 5553, '10.0.2.2', function (err) {
    if (err) {
      throw err;
    }
    console.log('Message sent!');
  });
}

export function updateMe(setLocationList) {
  const message = 'updateme';
  const socket2 = dgram.createSocket('udp4');
  socket2.bind(11223);
  socket2.send(message, 0, message.length, 5553, '10.0.2.2', function (err) {
    if (err) {
      console.log(err);
    }
    console.log('Update me, Message sent!');
  });
  socket2.on('message', function (msg, rinfo) {
    const msgString = `${msg}`;
    const arr = JSON.parse(msgString.split('(').join('[').split(')').join(']'));
    console.log('Set updated Location Data!');
    setLocationList(arr);
    console.log('list', arr);
    socket2.close();
  });
}

export function reportMyselfAsFound(socket, setLocationList) {
  let uniqueId = getUniqueId();
  console.log('Message is being sent.');
  const message = `found, ${uniqueId}`;
  socket.send(message, 0, message.length, 5553, '10.0.2.2', function (err) {
    if (err) {
      throw err;
    }
    console.log('Message sent!');
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
}
