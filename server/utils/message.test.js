var expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
	it('should generate the correct message object', () => {
		var from = "Marko";
		var text = "Test text";
		var message = generateMessage(from, text);

		expect(message.createdAt).toBeA('number');
		expect(message).toInclude({
			from: from,
			text: text
		});
	});
})

describe('generateLocationMessage', () => {
	it('should generate correct location object', () => {
		var from = "Marko";
		var lat = 1;
		var lng = 12;
		var url = `https://www.google.com/maps?q=${lat},${lng}`;
		var locations = generateLocationMessage(from, lat, lng);

		expect(locations.createdAt).toBeA('number');
		expect(locations).toInclude({
			from: from,
			url: url
		});
	})
})