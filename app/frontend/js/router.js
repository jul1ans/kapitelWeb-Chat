let Backbone 	= require('backbone'),
		$					= require('jquery')

import HomeView from './views/home'
import ResourcesView from './views/resources'

class Router extends Backbone.Router {

  constructor () {
    let routes = {
      '': 'home',
      'resources': 'resources'
    }
    super({
    	routes: routes
    })
  }

  home () {
    console.log('Route#home was called!')
    var view = new HomeView()
    $('#app').html(view.render().$el)
  }

  resources () {
    console.log('Route#resources was called!')
    var view = new ResourcesView()
    $('#app').html(view.render().$el)
  }

}

export default Router