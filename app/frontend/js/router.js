import Backbone 			from 'backbone'
import $							from 'jquery'
import io             from 'socket.io-client'
import RoomView 			from './views/rooms'
import ChatView 			from './views/chat'
import RoomCollection from './collections/roomCollection'
import UserCollection from './collections/userCollection'

class Router extends Backbone.Router {

  constructor () {
    super()

    // create new socket
    this.socket = io.connect()

    // init the collections
    this.userCollection = new UserCollection()
    this.roomCollection = new RoomCollection()

    // remove user from collection
    this.socket.on('deleteUser', (data) => {
      this.userCollection.get(data.user._id) && this.userCollection.get(data.user._id).destroy()
    }.bind(this))

    // listen to the 'addUserToRoom'
    this.socket.on('addUserToRoom', (data) => {
      // add the given user to the collection
      this.userCollection.create(data.user)
    })
  }

  // return routes
  // '' -> 'localhost:3000/' -> call room()
  // ':id' -> 'localhost:3000/12345' -> call chat(12345)
  routes () {
  	return {
      '': 		'rooms',
      ':id': 	'chat'
    }
  }

  // call after request a url (see routes())
  rooms () {
    console.log('Route#rooms was called!')
    
    // if socket is connected init the Room
    // otherwise wait till socket is connected and init the Room after
    if (this.socket.connected) {
      this.init(this.initRoom, null)
    }
    else {
      this.socket.on('connect', () => {
        this.init(this.initRoom, null)
      }.bind(this))
    }
  }

  // call after request a url (see routes())
  chat (id) {
    console.log(`Route#rooms/${id} was called!`)

    // if socket is connected init the Chat
    // otherwise wait till socket is connected and init the Chat after
    if (this.socket.connected) {
      this.init(this.initChat, id)
    }
    else {
      this.socket.on('connect', () => {
        this.init(this.initChat, id)
      }.bind(this))
    }
  }

  init(callback, id) {
    // is the currentUser is not available create a new user and call the right init function.
    // just call right init function if the currentUser is set
    if(!window.currentUser) {
      window.currentUser = this.userCollection.createUser(this.socket.id, id, function(){
        this.socket.emit('newUser',{ roomId: id, user: window.currentUser })
        callback.call(this, id)
      }.bind(this))
    }
    else {
      this.socket.emit('newUser',{ roomId: id, user: window.currentUser })
      callback.call(this, id)
    }
  }

  // init the Room View
  initRoom() {
    let init = () => {
      // get all rooms and init RoomView
      this.roomCollection.id = null;
      this.roomCollection.fetch({
        success: (rooms, res, opt) => {
          let view = new RoomView({ collection: this.roomCollection })
          $('#app').html(view.render().el)
        }
      })
    }

    // if the current user is in a room set the current room to null and save it
    // call init() after successfully update
    if( window.currentUser.get('_room') ){
      this.socket.emit('removeUserFromChatroom', { user: window.currentUser })
      window.currentUser.set({ _room: null })
      window.currentUser.save(window.currentUser.attributes,
        {
          success: init
        })
    }
    else {
      init()
    }
  }

  // init chat view
  initChat(id) {
    let init = (id) => {
      // get all rooms and init ChatView
      this.roomCollection.id = id
      this.roomCollection.fetch({
        success: (rooms, res, opt) => {
          let view = new ChatView({ collection: this.roomCollection, id: id })
          $('#app').html(view.render().el)
        }.bind(this)
      })
    }

    // if the current user is already in this room, call the init function
    // otherwise update the room, save it (send it to the backend) and call init after
    if( window.currentUser.get('_room') === id ){
      init()
    }
    else {
      this.socket.emit('addUserToChatroom', { user: window.currentUser, roomId: id })
      window.currentUser.set({ _room: id })
      window.currentUser.save(window.currentUser.attributes,
        {
          success: () => { init(id) }.bind(this)
        })
    }
  }
}

export default Router