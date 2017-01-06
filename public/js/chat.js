var socket = io();

function scrollToBottom () {
	var messages = $('#messages');
	var newMessage = messages.children('li:last-child');

	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	}
};

socket.on('connect', function () {
	// console.log('connected to server');
	var params = $.deparam(window.location.search);
	socket.emit('join', params, function (err) {

		if (err) {
			alert(err);
			window.location.href = '/';
		} else {
			console.log('no err');
		}
	});
});

socket.on('disconnect', function () {
	console.log('disconnected from server');
});

socket.on('updateUserList', function (users) {
	console.log('users: ', users);
	var ol = $('<ol></ol>');

	users.forEach(function (user) {
		ol.append($('<li></li>').text(user));
	});

	$('#users').html(ol);

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
	scrollToBottom();
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
	scrollToBottom();
});

$('#message-form').on('submit', function (e) {
	e.preventDefault();

	var messageTextbox = $('[name=message]');
	console.log('socketrL', socket);
	socket.emit('createMessage', {
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











