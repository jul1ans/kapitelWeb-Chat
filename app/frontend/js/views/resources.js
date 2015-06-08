let Backbone 	= require('backbone'),
		_					= require('underscore'),
		$					= require('jquery')

class ResourcesView extends Backbone.View {

  initialize () {
    this.template = $('script[name="resources"]').html();
  }

  render () {
    this.$el.html(_.template(this.template));
    return this;
  }
}

export default ResourcesView