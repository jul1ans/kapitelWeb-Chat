import Backbone 			from 'backbone'
import $							from 'jquery'
import HomeView 			from './views/home'
import RoomsView 			from './views/rooms'
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
    let view = new HomeView()
    $('#app').html(view.render().$el)
  }

  rooms () {
    console.log('Route#rooms was called!')
    let collection = new RoomCollection()
    let view = new RoomsView({ collection: collection })
    collection.fetch({
    	success: (rooms, res, opt) => {
    		view.render()
    	}
    })
  }

}

export default Router