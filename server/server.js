const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const {generateMessage, generateLocationMessage} = require('./utils/message');

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("new user connected");

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the app'));
    
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        io.emit('newMessage',generateMessage(message.from, message.text));
        callback("this is from server");
    });
    
    socket.on("createLocationMessage", (coords) => {
       io.emit('newLocationMessage', generateLocationMessage('Admin', coords.lat, coords.lon)) 
    });

    socket.on('disconnect', () => {
        console.log('user was dissconnected')
    })
});

server.listen(port, () => {
    console.log('Started up on port', port);
});

module.exports = {
    app
};
