import Backbone from 'backbone'

class User extends Backbone.Model {

	constructor (attrs, options) {
		super(attrs, options)
		// set the id field to '_id' (the id of MongoDB)
		this.__proto__.idAttribute = '_id'
	}

	initialize () {
		// set the id field to '_id' (the id of MongoDB)
		this.idAttribute = '_id'
	}

	// return the url to the API
	urlRoot() {
		return '/api/users'
	}

}

export default User