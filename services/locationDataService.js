export function sendYourLocationData(socket, uniqueId, location) {
  console.log('Message is being sent.');
  const message = `lost, ${uniqueId}, ${location.latitude}, ${location.longitude}`;
  socket.send(message, 0, message.length, 5553, '10.0.2.2', function (err) {
    if (err) {
      throw err;
    }
    console.log('Message sent!');
  });
}

export function updateMe(socket, setLocationList) {
  const message = 'updateme';
  socket.send(message, 0, message.length, 5553, '10.0.2.2', function (err) {
    if (err) {
      throw err;
    }
    console.log('Update me, Message sent!');
  });
  socket.on('message', function (msg, rinfo) {
    const msgString = `${msg}`;
    const arr = JSON.parse(msgString.split('(').join('[').split(')').join(']'));
    console.log('Set updated Location Data!');
    setLocationList(arr);
  });
}
