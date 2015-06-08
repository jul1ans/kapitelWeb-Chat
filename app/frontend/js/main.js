import Backbone from 'backbone'
import $				from 'jquery'
import Router 	from './router'

// This is a test Application
class Application {

  constructor () {
    new Router()
    Backbone.history.start()
  }

}

$(() => {
  new Application()
});

