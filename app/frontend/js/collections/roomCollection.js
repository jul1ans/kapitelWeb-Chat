import Backbone from 'backbone'
import Room 		from '../model/roomModel'

class RoomCollection extends Backbone.Collection {

	initialize () {
		this.model = Room
	}

	url () {
		return '/api/rooms'
	}

}

export default RoomCollection