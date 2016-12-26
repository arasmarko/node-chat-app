var socket = io();

socket.on('connect', function () {
	console.log('connected to server');
});

socket.on('disconnect', function () {
	console.log('disconnected from server');
});

socket.on('newMessage', function (message) {
	var formattedTime = moment(message.creaatedAt).format('h:mm a');
	var template = $('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		time: formattedTime,
		user: message.from
	});
	$('#messages').append(html);
});

socket.on('newLocationMessage', function (message) {
	var formattedTime = moment(message.creaatedAt).format('h:mm a');
	var template = $('#location-message-template').html();
	var html = Mustache.render(template, {
		url: message.url,
		time: formattedTime,
		user: message.from
	});
	$('#messages').append(html);
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











