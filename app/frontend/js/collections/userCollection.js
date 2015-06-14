import Backbone from 'backbone'
import User 		from '../model/userModel'

class UserCollection extends Backbone.Collection {

	// set the model of the collection
	initialize () {
		this.model = User
	}

	// return the url to the API
	url () {
		return '/api/users'
	}

	// create a new user with the given socketId and roomId
	// fire callback (cb) after successfuly create
	// return created user
	createUser (socketId, roomId, cb) {
		cb = cb || function(){};
		let user = new this.model({
			_socket: socketId || null,
			_room: roomId || null,
			name: `User${Date.now()%10000}`
		})
		this.create(user, {
			success: cb
		})
		return user;
	}

}

export default UserCollection