var expect = require('expect');
var {isRealString} = require('./validation');

describe('isRealString', () => {
	it('it should reject non string values', () => {
		var res = isRealString(98);
		expect(res).toBe(false);
	});

	it('it should reject empty value', () => {
		var res = isRealString('  ');
		expect(res).toBe(false);
	});

	it('it should accept valid string', () => {
		var res = isRealString(' marko ');
		expect(res).toBe(true);
	});
});
