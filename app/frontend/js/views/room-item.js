import Backbone from 'backbone'
import _				from 'underscore'
import $				from 'jquery'

class RoomItemView extends Backbone.View {

  initialize () {
    // init some attributes for the view
    this.template	= _.template($('script[name="rooms-item"]').html())

    // bind the events to the model
    this.model.bind("change", this.render, this);
    this.model.bind("destroy", this.close, this);
  }

  // return the class name of the wrapper element
  className () {
    return 'row'
  }

  // render the room items
  render () {
    $(this.el).html(this.template(this.model.toJSON()));
    return this
  }

  // remove the element events and remove it from the DOM
  close () {
    $(this.el).unbind();
    $(this.el).remove();
  }
}

export default RoomItemView