let Backbone 	= require('backbone'),
		_					= require('underscore'),
		$					= require('jquery')

class RoomsView extends Backbone.View {

  initialize () {
    this.template = $('script[name="rooms"]').html();
  }

  render () {
    this.$el.html(_.template(this.template));
    return this;
  }
}

export default RoomsView