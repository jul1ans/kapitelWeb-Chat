import Backbone 			from 'backbone'
import $							from 'jquery'
import io             from 'socket.io-client'
import RoomView 			from './views/rooms'
import ChatView 			from './views/chat'
import RoomCollection from './collections/roomCollection'
import RoomModel      from './model/roomModel'

class Router extends Backbone.Router {

  constructor () {
    super()

    this.chatroom = null

    // create new socket
    this.socket = io()
    this.socket.on('connect', (data) => {
      console.log("connected with server")
    })

    this.socket.on('newConnection', (obj) => {
      console.log(obj.users)
      this.user = {
        id: obj.user.id
      }
    })
  }

  routes () {
  	return {
      '': 		'rooms',
      ':id': 	'chat'
    }
  }

  rooms () {
    console.log('Route#rooms was called!')

    // remove user from chatroom
    this.socket.emit('removeUserFromChatroom', {id: this.chatroom})
    this.chatroom = null

    let collection = new RoomCollection()
    collection.fetch({
    	success: (rooms, res, opt) => {
        let view = new RoomView({ collection: collection })
    		$('#app').html(view.render().el)
    	}
    })
  }

  chat (id) {
    console.log(`Route#rooms/${id} was called!`)

    this.socket.emit('removeUserFromChatroom', {id: id})

    let collection = new RoomCollection(id)
    let view = new ChatView({ collection: collection, id: id })
    collection.fetch({
      success: (rooms, res, opt) => {
        $('#app').html(view.render().el)
    	}
    })
  }
}

export default Router