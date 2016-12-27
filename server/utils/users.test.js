var expect = require('expect');
var {Users} = require('./users');

describe('Users', () => {
	users = new Users();
	users.users = [{
		id: '1',
		name: 'Marko',
		room: 'Room 1'
	},{
		id: '2',
		name: 'Pero',
		room: 'Room 1'
	}, {
		id: '3',
		name: 'Mate',
		room: 'Room 2'
	}];

	beforeEach( () => {

	});
	// addUser
	it('should add new user', () => {
		var users = new Users();
		var user = {
			id: '123',
			name: 'Marko',
			room: 'Room 1'
		};

		var resUser = users.addUser(user.id, user.name, user.room);
		expect(users.users).toEqual([user]);
	});

	//removeUser
	it('should remove user', () => {
		var user = users.removeUser('3');
		expect(user.id).toBe('3');
		expect(users.users.length).toBe(2);
	});

	it('should not remove user with unknown id', () => {
		var user = users.removeUser('99');
		expect(user).toNotExist();
		expect(users.users.length).toBe(2);
	});

	//getUser
	it('should return user with id', () => {
		var user = users.getUser('1');
		expect(user.id).toBe('1');
	});

	it('should not return user with unknown id', () => {
		var user = users.getUser('4');
		expect(user).toBe(undefined);
	});

	//getUserList
	it('should return names for Room 1', () => {
		var names = users.getUserList('Room 1');
		expect(names).toEqual(['Marko', 'Pero']);
	});
	
});















