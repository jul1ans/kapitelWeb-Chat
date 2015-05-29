var $  = require './js/libs/jquery.min.js';
var underscore = require './js/libs/underscore.min.js';
var Backbone = require './js/libs/backbone.min.js'

import Router from './router';

class Application {

    constructor () {
        new Router();
        Backbone.history.start();
    }

}

$(() => {
    new Application();
});

