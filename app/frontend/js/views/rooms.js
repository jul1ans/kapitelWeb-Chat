import Backbone     from 'backbone'
import _				    from 'underscore'
import $				    from 'jquery'
import RoomItemView from './room-item'

class RoomView extends Backbone.View {

  initialize () {
    this.list = '#rooms'
  	this.template	= _.template($('script[name="rooms"]').html())

  	this.collection.bind("reset", this.render, this)
    this.collection.bind("add", (room) => {
      $(this.list).append(new RoomItemView({model:room}).render().el)
    }.bind(this))
    this.collection.bind("change", this.render, this)
    this.collection.bind("destroy", this.close, this)
  }

  className () {
    return 'roomlist'
  }

  events () {
    return {
      'click .new':           'showModal',
      'click .overlay':       'hideModal',
      'click .remove':        'removeRoom',
      'submit .newRoomForm':  'createNewRoom'
    }
  }

  render () {
  	this.$el.html(this.template)
    _.each(this.collection.models, (room) => {
      $(this.el).find(this.list).append(new RoomItemView({model:room}).render().el)
    }, this);
    return this
  }

  showModal (e) {
    e.preventDefault()
    $('.overlay').show()
  }

  hideModal (e) {
    if( !e || $(e.target).is('.overlay') ){
      $('.overlay').hide()
    }
  }

  createNewRoom (e) {
    e.preventDefault()
    let $elem = $(e.currentTarget)
    let data = this.serializeToObject($elem.serializeArray())
    let model = new this.collection.model(data)
    model.save(
      data,
      {
        success: (room, obj) => {
          $elem.find('input').val('')
          this.collection.create(model)
          this.hideModal()
        }.bind(this)
      })
  }

  removeRoom (e) {
    e.preventDefault()
    let $elem = $(e.currentTarget)
    this.collection.get($elem.data('id')).destroy({
      success: () => {
        console.log('Room deleted successfully')
      }
    })
  }

  serializeToObject (arr) {
    let obj = {}
    for(let a of arr) {
      obj[a.name] = a.value
    }
    return obj
  }
}

export default RoomView