let Backbone 	= require('backbone'),
		_					= require('underscore'),
		$					= require('jquery')

class RoomsView extends Backbone.View {

  initialize () {
  	this.$el = $('#app')
  	this.template = _.template($('script[name="rooms"]').html())
  	this.collection.bind('reset', console.log)
  }

  render () {
    this.collection.each(function(model){
      let profileTemplate = this.template(model.toJSON())
      this.$el.append(profileTemplate);
    }, this);        
    return this;
  }
}

export default RoomsView