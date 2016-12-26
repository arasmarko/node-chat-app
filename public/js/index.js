var socket = io();

socket.on('connect', function () {
	console.log('connected to server');
});

socket.on('disconnect', function () {
	console.log('disconnected from server');
});

socket.on('newMessage', function (message) {
	console.log('new message: ', message);
	var li = $('<li></li>');
	li.text(`${message.from}: ${message.text}`);

	$('#messages').append(li);
});

// socket.emit('createMessage', {
// 	from: 'Frane',
// 	text: 'Hello'
// }, (data) => {
// 	console.log('got it ', data);
// });

$('#message-form').on('submit', function (e) {
	e.preventDefault();

	socket.emit('createMessage', {
		from: 'User',
		text: $('[name=message]').val()
	}, (data) => {
		console.log('got it ', data);
	});

});
