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

    socket.on('rooms', (rooms) => {
        socket.emit('getRoomsList', users.getLists())
    });
    
    socket.on('join', (params, calback) => {
        let roomUppercase = params.room.toLowerCase();

        if(!isRealString(params.name) || !isRealString(roomUppercase)) {
            return calback('Name and room name are required.')
        } 
    
        socket.join(roomUppercase);
        users.removeUser(socket.id);
        try {
            users.addUser(socket.id, params.name, roomUppercase);
        }
        catch(error) {
            return calback('This name is already in use.')
        }
        io.to(roomUppercase).emit('updateUserList', users.getUserList(roomUppercase));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the app'));
        socket.broadcast.to(roomUppercase).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        
        calback();
    });
    
    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);
        
        if(user && isRealString(message.text)){
           io.to(user.room).emit('newMessage',generateMessage(user.name, message.text)); 
        }
        
        callback();
    });
    
    socket.on("createLocationMessage", (coords) => {
        let user = users.getUser(socket.id);    
        
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.lat, coords.lon)) 
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
