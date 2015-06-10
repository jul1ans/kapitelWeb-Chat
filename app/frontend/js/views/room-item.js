import Backbone from 'backbone'
import _				from 'underscore'
import $				from 'jquery'

class RoomItemView extends Backbone.View {

  initialize () {
  	this.template	= _.template($('script[name="rooms-item"]').html())

    this.model.bind("change", this.render, this);
    this.model.bind("destroy", this.close, this);
  }

  className () {
    return 'row'
  }

  render () {
    $(this.el).html(this.template(this.model.toJSON()));
    return this
  }

  close () {
    $(this.el).unbind();
    $(this.el).remove();
  }
}

export default RoomItemView