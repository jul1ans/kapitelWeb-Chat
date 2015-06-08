let Backbone 		= require('backbone'),
		$  					= require('jquery')

import Router from './router'

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

