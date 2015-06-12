import Backbone from 'backbone'

class User extends Backbone.Model {

	constructor (attrs, options) {
		super(attrs, options)
		this.__proto__.idAttribute = '_id'
	}

	initialize () {
		this.idAttribute = '_id'
	}

	urlRoot() {
		return '/api/users'
	}

}

export default User