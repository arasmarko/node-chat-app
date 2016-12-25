var socket = io();

socket.on('connect', function () {
	console.log('connected to server');

	socket.emit('createEmail', {
		to: 'alo@bre.com',
		text: 'alo breee iz browsera'
	});
});

socket.on('disconnect', function () {
	console.log('disconnected from server');
});

socket.on('newEmail', function (data) {
	console.log('new email: ', data);
});
