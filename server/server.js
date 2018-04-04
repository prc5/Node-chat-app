const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("new user connected");

    socket.on('join', (params, calback) => {
        if(!isRealString(params.name) || !isRealString(params.room)) {
            return calback('Name and room name are required.')
        }
        
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        
        calback();
    });
    
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        io.emit('newMessage',generateMessage(message.from, message.text));
        callback("this is from server");
    });
    
    socket.on("createLocationMessage", (coords) => {
       io.emit('newLocationMessage', generateLocationMessage('Admin', coords.lat, coords.lon)) 
    });

    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);
        if (user) {
           io.to(user.room).emit('updateUserList', users.getUserList(user.room)); 
           io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} has left`)); 
        }
    })
});

server.listen(port, () => {
    console.log('Started up on port', port);
});

module.exports = {
    app
};
