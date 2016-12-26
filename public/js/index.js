var socket = io();

socket.on('connect', function () {
	console.log('connected to server');
});

socket.on('disconnect', function () {
	console.log('disconnected from server');
});

socket.on('newMessage', function (message) {
	var formattedTime = moment(message.creaatedAt).format('h:mm a');
	console.log('new message: ', message);
	var li = $('<li></li>');
	li.text(`${formattedTime} ${message.from}: ${message.text}`);

	$('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
	var formattedTime = moment(message.creaatedAt).format('h:mm a');
	var li = $('<li></li>');
	var a = $('<a target="_blank">My current location</a>');
	li.text(`${formattedTime} ${message.from}: `);
	a.attr('href', message.url);
	li.append(a);
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

	var messageTextbox = $('[name=message]');

	socket.emit('createMessage', {
		from: 'User',
		text: messageTextbox.val()
	}, () => {
		messageTextbox.val('');
	});

});

var locationButton = $('#send-location');

locationButton.on('click', function (e) {
	if (!navigator.geolocation) {
		return alert('geolocation not supported in your browser', 'title');
	}

	locationButton.attr('disabled', 'disabled').text('Sending location...');

	navigator.geolocation.getCurrentPosition( function (position) {
		locationButton.removeAttr('disabled').text('Send location');
		console.log('message: ', position);
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		})
	}, function () {
		locationButton.removeAttr('disabled').text('Send location');
		alert('unable to fetch location', 'title');
	},{timeout:10000});
});











