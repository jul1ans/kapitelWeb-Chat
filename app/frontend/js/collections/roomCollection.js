import Backbone from 'backbone'
import Room 		from '../model/roomModel'

class RoomCollection extends Backbone.Collection {

	initialize () {
		this.url = '/api/rooms'
		this.model = Room
	}

}

export default RoomCollection