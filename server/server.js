const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
var moment = require('moment');
var {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('new user connected: ');

	socket.on('join', (params, callback) => {
		//isRealString
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and room name are required');
		}

		socket.join(params.room);
		// to current user
		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
		// socket.leave(params.room);

		//to room
		//io.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

		//to all except current user
		// socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

		//to everybody in room except current user
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, params.room);

		io.to(params.room).emit('updateUserList', users.getUserList(params.room));

		

		callback();
	});

	socket.on('createMessage', (message, callback) => {
		console.log('create message socket: ', message);
		var user = users.getUser(socket.id);
		if (user && isRealString(message.text)) {
			io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
			callback();
		}
		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// });

	});


	socket.on('createLocationMessage', (coords) => {

		var user = users.getUser(socket.id);
		if (user) {
			// io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
			io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
		}

		
	});


	socket.on('disconnect', () => {
		console.log('user disconnected');
		var user = users.removeUser(socket.id);

		if (user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
		}
	});

	
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
