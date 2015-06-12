import Backbone from 'backbone'
import User 		from '../model/userModel'

class UserCollection extends Backbone.Collection {

	initialize () {
		this.model = User
	}

	url () {
		return '/api/users'
	}

}

export default UserCollection