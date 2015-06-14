import Backbone       from 'backbone'
import _              from 'underscore'
import $              from 'jquery'
import io             from 'socket.io-client'

class ChatView extends Backbone.View {

  constructor (data) {
    super(data)
  }

  initialize () {
    // init some attributes for the view
    this.socket = io.connect()
    this.chatTemp = _.template($('script[name="chat"]').html())
    this.msgTemp  = _.template($('script[name="message"]').html())
    this.msgContainer = '#messages'

    // render the userlist on collection change (insert, remove, update)
    this.collection.bind("change", () => {
      this.renderUsers()
    }, this)

    // execute addMessage if the socket emits 'chat message'
    this.socket.on('chat message', this.addMessage.bind(this))

    // socket listen on 'addUserToRom'
    this.socket.on('addUserToRoom', (data) => {
      // get all users in the collection
      let userList = this.collection.get(data.roomId).get('users')
      // filter the userlist for the given user id
      let inList = userList.filter((u) => { return data.user._id === u._id })
      // if the length of the filterd list is 0, the user is not in the list
      if( inList.length === 0) {
        // add the user to the list
        userList.push(data.user)
      }
      // set the new list for the collection
      this.collection.get(data.roomId).set({ users: userList })
      // render the userlist
      this.renderUsers()
    }.bind(this))

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
        // render the userlist
        this.renderUsers()
      }
    })
  }

  // return the events of the view
  // '<action> <selector>': '<function>'
  events() {
    return {
      'keypress #messageText':  'messageEvent',
      'click #sendMessage':     'sendMessage'
    }
  }

  // return the class name of the wrapper element
  className() {
    return 'chat'
  }

  // render all
  render () {
  	this.$el.html(this.chatTemp)
    this.renderUsers()
    return this
  }

  // append the given message to the chat message container
  addMessage (msg) {
    this.$el.find(this.msgContainer).append(this.msgTemp(msg))
    this.$el.find(this.msgContainer).animate({
      scrollTop: this.$el.find(this.msgContainer).height()
    })
  }

  // input keypress event
  messageEvent (e) {
    // if pressed key is enter (13) prevent the default action and execute sendMessage
    if (e.which == 13) {
      e.preventDefault()
      this.sendMessage()
    }
  }

  // send the message
  sendMessage (sender) {
    // if the given sender is undefined set the name of the current user
    sender = sender || window.currentUser.get('name')
    // get the message text
    let $msgText = this.$el.find('#messageText')
    // emit 'sendMessage' with some properties
    this.socket.emit('sendMessage',
      { 
        sender: sender,
        text: $msgText.val(),
        roomId: this.id
      })
    // clear the input
    $msgText.val('')
  }

  // render the userlist
  renderUsers () {
    // check if the current room id is available
    if( !this.collection.get(this.id) ){
      return
    }
    // get all users in the current room and map them to their names
    let users = this.collection.get(this.id).get('users').map((item) => item.name )
    // get the userlist element and set the array as text
    let $list = this.$el.find('#userlist')
    $list.html(users.join(', '))
  }

}

export default ChatView