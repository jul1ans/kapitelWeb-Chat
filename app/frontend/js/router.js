import Backbone 			from 'backbone'
import $							from 'jquery'
import RoomsView 			from './views/rooms'
import ChatView 			from './views/chat'
import RoomCollection from './collections/roomCollection'

class Router extends Backbone.Router {

  constructor () {
    super()
  }

  routes () {
  	return {
      '': 		'rooms',
      ':id': 	'chat'
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

  chat (id) {
    console.log(`Route#rooms/${id} was called!`)
    let collection = new RoomCollection(id)
    let view = new ChatView({ collection: collection })
    collection.fetch({
    	success: (rooms, res, opt) => {
    		view.render()
    	}
    })
  }

}

export default Router