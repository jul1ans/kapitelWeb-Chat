let Backbone 	= require('backbone'),
		$					= require('jquery')

import HomeView from './views/home'
import RoomsView from './views/rooms'

import RoomCollection from './collections/roomCollection'

class Router extends Backbone.Router {

  constructor () {
    let routes = {
      '': 'home',
      'rooms': 'rooms'
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

  rooms () {
    console.log('Route#rooms was called!')
    var view = new RoomsView()
    $('#app').html(view.render().$el)
  }

}

export default Router