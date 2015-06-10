import Backbone 			from 'backbone'
import $							from 'jquery'
import RoomView 			from './views/rooms'
import ChatView 			from './views/chat'
import RoomCollection from './collections/roomCollection'
import RoomModel      from './model/roomModel'

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
    collection.fetch({
    	success: (rooms, res, opt) => {
        let view = new RoomView({ collection: collection })
    		$('#app').html(view.render().el)
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