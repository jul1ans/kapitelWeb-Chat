import Backbone from 'backbone'
import _				from 'underscore'
import $				from 'jquery'

class ChatView extends Backbone.View {

  initialize () {
  	this.$el 			= $('#app')
    this.chatTemp = _.template($('script[name="chat"]').html())
  }

  render () {
  	this.$el.html(this.chatTemp)
    /*this.collection.each((model) => {
      let itemTemplate = this.itemTem(model.toJSON())
      this.$el.find(this.list).append(itemTemplate);
    }, this)*/
    return this
  }
}

export default ChatView