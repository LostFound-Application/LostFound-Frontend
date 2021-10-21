# Application Documentation

The application (seen below in the picture) consists of only one main screen that includes the map, two buttons, your location marker and markers of people that are lost.

<img src="https://github.com/LostFound-Application/LostFound-Front-New/blob/master/documentation/app_picture.png" alt="App" width="300"/>

The map that is used in application is from Goole Maps API. The map uses react-native-maps library for components used for the map and the markers. Your own location can also been seen on the map as the blue marker with the arrow that shows the way the phone is heading towards. There also is "Locate yourself"-button on top-right and also some other features like button (that can be seen when clicking a marker on the map), which opens Google Maps application with directions to the selected marker.

Below the map there are the two main buttons of the app. The first red button, which title is "Report Myself as Lost" continues to the following function -> It will create and send UDP socket with string including device's unique id, location (latitude, longitude) and 'lost' text to the backend's interface that will save the sent data to the database as lost person. The server will send back the confirmation to the app and the app responds with OK message back to the server.

The second button has the same functionality but this time it will create and send the UDP socket with string that includes the device's unique id and text 'found'. Backend side will handle the API call and send confirmation back to the app that responds 'OK' back to the server when it has received the confirmation. 

The application currently has 10 seconds loop that sends 'update' API call to the backend. It works the same as previously the buttons worked that it creates the UDP socket with message 'updateme' and sends it to the server. Server will respond back with the list of all coordinates of lost devices. After that the code converts the list to nested array for easier access for React. The nested array with all the location data will be set to a React state 'locationList' with hooks. The changed state will then update the map component and add markers for all the locations of the devices that were set to the state.

Markers of the lost people have configurable 500 meter radius around the location data that the app receives from the server. This is because of the GPS data can be inaccurate and it's more convenient for the searchers to have an area that they can look for the lost people. Markers can also be clicked and it will show the coordinate of the chosen marker inside tooltip box. 
