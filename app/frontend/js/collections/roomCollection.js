import Backbone from 'backbone'
import Room 		from '../model/roomModel'

class RoomCollection extends Backbone.Collection {

	initialize (id) {
		this.id = id
		this.url = `/api/rooms/${this.id || ''}`
		this.model = Room
	}

}

export default RoomCollection