let Backbone 	= require('backbone'),
		Room 			= require('../model/roomModel')

class RoomCollection extends Backbone.Collection {

	initialize () {
		this.url = '/api/rooms'
		this.model = Room
	}
	
}

export default RoomCollection