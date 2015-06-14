import Backbone     from 'backbone'
import _            from 'underscore'
import $            from 'jquery'
import RoomItemView from './room-item'
import io           from 'socket.io-client'

// class to render rooms and handle the events
class RoomView extends Backbone.View {

  initialize () {
    // id of the container of the rooms
    this.list = '#rooms'
    this.socket = io.connect()
    this.template	= _.template($('script[name="rooms"]').html())

    // this event is triggert on this.collection.create(model)
    this.collection.bind("add", (room) => {
      $(this.list).append(new RoomItemView({model:room}).render().el)
      this.delegateEvents()
    }.bind(this))

    // render all again if collection has changed
    this.collection.bind("change", () => {
      this.render()
      this.delegateEvents()
    }.bind(this))

    // socket listen on 'removeUser'
    this.socket.on('removeRoom', (data) => {
      // if the collection with the given id is available delete it
      this.collection.get(data.roomId) && this.collection.get(data.roomId).destroy()
    })


    // socket listen on 'roomCreated'
    this.socket.on('roomCreated', (data) => {
      // create a new room and add it to the collection
      this.collection.create(data.room)
    })

    // socket listen on 'removeUser'
    this.socket.on('removeUser', (data) => {
      // if the collection of the room of the _room attribute of the user is available
      // get the list. return false otherwise
      let userList = 
        this.collection.get(data.user._room) && this.collection.get(data.user._room).get('users')
      if( userList ) {
        // get all users in the list, except the given one
        userList = userList.filter((u) => { return u._id !== data.user._id })
        // set the new userlist
        this.collection.get(data.user._room).set({ users: userList })
        // render the view
        this.render()
      }
    })

    // socket listen on 'addUserToRoom'
    this.socket.on('addUserToRoom', (data) => {
      // get the userlist of the room with the given id
      let userlist = this.collection.get(data.roomId).get('users')
      // filter the list by check the id of the users
      let inList = userlist.filter((u) => { return data.user._id === u._id })
      // if filterd list length is 0 the given user is not in the list
      if( inList.length === 0) {
        // add the user to the list
        userlist.push(data.user)
      }
      // set the new list as userlist of the collection
      this.collection.get(data.roomId).set({ users: userlist })
      // render the view
      this.render()
    }.bind(this))
  }

  // The classname of the wrapper of the room list
  className () {
    return 'roomlist'
  }

  // return all event on the room list view
  events () {
    return {
      'click .new':           'showModal',
      'click .overlay':       'hideModal',
      'click .remove':        'removeRoom',
      'submit .newRoomForm':  'createNewRoom'
    }
  }

  // render all
  render () {
  	this.$el.html(this.template)
    // append the RoomView for every room in the room collection
    _.each(this.collection.models, (room) => {
      $(this.el).find(this.list).append(new RoomItemView({model:room}).render().el)
    }, this);
    return this
  }

  // show the modal
  showModal (e) {
    e.preventDefault()
    $('.overlay').show()
  }

  // hide the modal
  hideModal (e) {
    // if a event is given (click) and the clicked element is the overlay hide the modal
    // if no event is given, hide the modal
    if( !e || $(e.target).is('.overlay') ){
      $('.overlay').hide()
    }
  }

  // send the formular to the backend
  createNewRoom (e) {
    e.preventDefault()
    let $elem = $(e.currentTarget)
    // get all data from the formular and make an object out of it
    let data = this.serializeToObject($elem.serializeArray())
    // init the new model
    let model = new this.collection.model(data)
    // save the new model. backbone makes a request to the backend
    model.save(
      data,
      {
        success: (room, obj) => {
          $elem.find('input').val('')
          // add the model to the collection
          this.collection.create(model)
          // hide the modal
          this.hideModal()
          // emit 'createRoom' with the created room as parameter
          this.socket.emit('createRoom', { room: room })
        }.bind(this)
      })
  }

  // delete a room
  removeRoom (e) {
    e.preventDefault()
    // get the id of the room to delete
    let id = $(e.currentTarget).data('id')
    // get the room and delete it. backbone makes a request to the backend
    this.collection.get(id).destroy({
      success: () => {
          // emit 'createRoom' with the id of the deleted room as parameter
        this.socket.emit('deleteRoom', { roomId: id })
      }.bind(this)
    })
  }

  // map the serialized Array of a form to an object
  serializeToObject (arr) {
    let obj = {}
    for(let a of arr) {
      obj[a.name] = a.value
    }
    return obj
  }
}

export default RoomView