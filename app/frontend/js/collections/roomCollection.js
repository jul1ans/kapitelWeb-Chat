import Backbone from 'backbone'
import Room 		from '../model/roomModel'

class RoomCollection extends Backbone.Collection {

	// set the model of the collection
	initialize () {
		this.model = Room
	}

	// return the url to the API
	url () {
		return '/api/rooms'
	}

}

export default RoomCollection