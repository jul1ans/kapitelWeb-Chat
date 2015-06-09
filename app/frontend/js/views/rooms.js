import Backbone from 'backbone'
import _				from 'underscore'
import $				from 'jquery'

class RoomsView extends Backbone.View {

  initialize () {
  	this.list			= '#rooms'
  	this.template = _.template($('script[name="rooms"]').html())
  	this.itemTem	= _.template($('script[name="rooms-item"]').html())
  	this.collection.bind('reset', console.log)
  }

  className () {
    return 'container'
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
    this.collection.each((model) => {
      let itemTemplate = this.itemTem(model.toJSON())
      this.$el.find(this.list).append(itemTemplate);
    }, this)
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
    $.post($elem.attr('action'), $elem.serializeArray(), (data) => {
      this.hideModal()
    }.bind(this))
  }

  removeRoom (e) {
    e.preventDefault()
    let $elem = $(e.currentTarget)
    $.ajax({
      url: $elem.attr('href'),
      method: 'DELETE',
    }).then(() => {
      console.log('deleted')
    })
  }
}

export default RoomsView