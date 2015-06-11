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

  home () {
    console.log('Route#home was called!')
    let view = new HomeView()
    $('#app').html(view.render().$el)
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

    this.socket.emit('removeUserFromChatroom', {id: this.chatroom})
    this.chatroom = id

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

          $messageContainer.animate({
            scrollTop: $messageContainer.height()
          })
        })

        // send message

        $('#messageText').keypress(function(event) {
            if (event.which == 13) {
              event.preventDefault();
              $('#sendMessage').trigger('click')
            }
        });

        $('#sendMessage').on('click', () => {
          this.socket.emit('sendMessage', $('#messageText').val())
          $('#messageText').val('')
        })

        // get userlist

        this.socket.emit('getUserlist')
        this.socket.on('sendUserlist', (users) => {
          let $list = $('#userfield #list')
          $list.html("")
          for(let i = 0, length = users.length; i < length; i++) {
            if (users[i] != null) {
              $list.append(`
                <li>
                  ${users[i]}
                </li>
                `)
            }
          }
        })
    	}
    })
  }
}

export default Router