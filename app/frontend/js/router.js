var Backbone = require('backbone');

import { HomeView as home, TestView as testview } from './views';

class Router extends Backbone.Router {

    constructor () {
        super();
        this.routes = {
            '': 'home',
            'testview': 'testview'
        };
    }

    home () {
        console.log('Router#home was called!');
        var view = new HomeView();
        $('#app').html(view.render().$el);
    }

    testview () {
        console.log('Router#testview was called!');
        var view = new TestView();
        $('#app').html(view.render().$el);
    }

}

export default Router;