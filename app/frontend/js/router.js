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

    // create new socket

    this.socket = io()
    this.socket.on('connect', (data) => {
      console.log("connected with server")
    })

    this.socket.on('newUser', (obj) => {
      this.user = {
        id: obj.id
      }
    })
  }

  routes () {
  	return {
      '': 		'rooms',
      ':id': 	'chat'
    }
  }

  home () {
    console.log('Route#home was called!')
    let view = new HomeView()
    $('#app').html(view.render().$el)
  }

  rooms () {
    console.log('Route#rooms was called!')
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

    // add user to chatroom

    this.socket.emit('addUserToChatroom', {id: id})

    let collection = new RoomCollection(id)
    let view = new ChatView({ collection: collection })
    collection.fetch({
      success: (rooms, res, opt) => {
        view.render()

        let $messageContainer = $('#chat #messages')


        // receive messages

        this.socket.on('message', (message) => {
          $messageContainer.append(`
            <div>
              <span class='sender'>
                ${message.sender}:
              </span>
              <span class='text'>
                ${message.text}
              </span>
            </div>

            `)
        })

        // send message

        $('#sendMessage').on('click', () => {
          this.socket.emit('sendMessage', $('#messageText').val())
        })
    	}
    })
  }

}

export default Router