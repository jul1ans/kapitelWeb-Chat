import Backbone from 'backbone'
import _				from 'underscore'
import $				from 'jquery'
import io       from 'socket.io-client'

class ChatView extends Backbone.View {

  initialize () {
    this.socket = io()
    this.chatTemp = _.template($('script[name="chat"]').html())
    this.msgTemp  = _.template($('script[name="message"]').html())
    this.msgContainer = '#messages'

    this.socket.emit('addUserToChatroom', {id: this.id})
    this.socket.on('message', this.addMessage.bind(this))

    // get userlist
    this.socket.emit('getUserlist')
    this.socket.on('sendUserlist', (users) => {
      let $list = $('#userfield #list')
      $list.html(users.join(', '))
    })
  }

  events() {
    return {
      'keypress #messageText':  'messageEvent',
      'click #sendMessage':     'sendMessage'
    }
  }

  className() {
    return 'chat'
  }

  render () {
  	this.$el.html(this.chatTemp)
    return this
  }

  addMessage (msg) {
    this.$el.find(this.msgContainer).append(this.msgTemp(msg))

    this.$el.find(this.msgContainer).animate({
      scrollTop: this.$el.find(this.msgContainer).height()
    })
  }

  messageEvent (e) {
    if (e.which == 13) {
      e.preventDefault()
      this.sendMessage()
    }
  }

  sendMessage () {
    let $msgText = this.$el.find('#messageText')
    this.socket.emit('sendMessage', $msgText.val())
    $msgText.val('')
  }
}

export default ChatView