import Backbone from 'backbone'
import _				from 'underscore'
import $				from 'jquery'

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