const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
var moment = require('moment');
var {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('new user connected: ');

	

	

	socket.on('join', (params, callback) => {
		//isRealString
		if (!isRealString(params.name) || !isRealString(params.room)) {
			callback('Name and room name are required');
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
		

		callback();
	});

	socket.on('createMessage', (message, callback) => {
		console.log('create message: ', message);
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback();
		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// });

	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on('createLocationMessage', (coords) => {

		io.emit('newLocationMessage', generateLocationMessage("Admin", coords.latitude, coords.longitude));
	});

	
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
