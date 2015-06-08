import Backbone 			from 'backbone'
import $							from 'jquery'
import HomeView 			from './views/home'
import RoomsView 			from './views/rooms'
import RoomCollection from './collections/roomCollection'

class Router extends Backbone.Router {

  constructor () {
    super()
  }

  routes () {
  	return {
      '': 'home',
      'rooms': 			'rooms',
      'rooms/:id': 	'room'
    }
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

  room (id) {
    console.log(`Route#rooms/${id} was called!`)
    let collection = new RoomCollection(id)
    let view = new RoomsView({ collection: collection })
    collection.fetch({
    	success: (rooms, res, opt) => {
    		view.renderOne()
    	}
    })
  }

}

export default Router