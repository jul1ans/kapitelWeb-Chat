let Backbone = require('backbone')

class RoomCollection extends Backbone.Collection {
  url: '/api/rooms'
}

export default RoomCollection