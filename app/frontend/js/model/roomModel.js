import Backbone from 'backbone'

class Room extends Backbone.Model {

	constructor (attrs, options) {
		super(attrs, options)
		this.__proto__.idAttribute = '_id'
	}

	initialize () {
		this.idAttribute = '_id'
	}

	urlRoot() {
		return '/api/rooms'
	}

}

export default Room