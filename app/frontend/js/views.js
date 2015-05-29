var Backbone = require('backbone');

class HomeView extends Backbone.View {

    initialize () {
        this.template = renderFromFile('home', {});
    }

    render () {
        this.$el.html(this.template);
        return this;
    }

}

class TestView extends Backbone.View {

    initialize () {
        this.template = renderFromFile('test', {});
    }

    render () {
        this.$el.html(this.template);
        return this;
    }

}


function renderFromFile(tmpl_name, tmpl_data) {
    if ( !render.tmpl_cache ) { 
        render.tmpl_cache = {};
    }

    if ( ! render.tmpl_cache[tmpl_name] ) {
        var tmpl_dir = '/templates';
        var tmpl_url = tmpl_dir + '/' + tmpl_name + '.html';

        var tmpl_string;
        $.ajax({
            url: tmpl_url,
            method: 'GET',
            async: false,
            success: function(data) {
                tmpl_string = data;
            }
        });

        render.tmpl_cache[tmpl_name] = _.template(tmpl_string);
    }

    return render.tmpl_cache[tmpl_name](tmpl_data);
}

export { HomeView, TestView };