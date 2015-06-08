let Backbone 	= require('backbone'),
		_					= require('underscore'),
		$					= require('jquery')

class HomeView extends Backbone.View {

  initialize () {
    this.template = $('script[name="home"]').html();
  }

  render () {
    this.$el.html(_.template(this.template));
    return this;
  }
}

export default HomeView