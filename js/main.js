/**
 * Created with JetBrains WebStorm.
 * User: Alamgir
 * Date: 5/7/12
 * Time: 11:22 PM
 * To change this template use File | Settings | File Templates.
 */
var App = {
    initialize: function() {
        var sync = Backbone.sync;
        Backbone.sync = function(method, model, options) {
            options.error = function(xhr, ajaxOptions, thrownError) {
                if (xhr.status == 401) {
                    window.location = '/';
                }
            };
            sync(method, model, options);
        };

        this.router = new AppRouter();
        Backbone.history.start({pushState: true});

    }
};


