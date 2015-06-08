import Backbone from 'backbone'
import _				from 'underscore'
import $				from 'jquery'

class RoomsView extends Backbone.View {

  initialize () {
  	this.$el 			= $('#app')
  	this.list			= '#rooms'
  	this.template = _.template($('script[name="rooms"]').html())
  	this.itemTem	= _.template($('script[name="rooms-item"]').html())
  	this.collection.bind('reset', console.log)
  }

  render () {
  	this.$el.html(this.template)
    this.collection.each((model) => {
      let itemTemplate = this.itemTem(model.toJSON())
      this.$el.find(this.list).append(itemTemplate);
    }, this)
    return this
  }

  renderOne () {
    console.log(this.collection)
  }
}

export default RoomsView