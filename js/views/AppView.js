/**
 * Created with JetBrains WebStorm.
 * User: Alamgir
 * Date: 5/9/12
 * Time: 1:21 AM
 * To change this template use File | Settings | File Templates.
 */
var AppView = Backbone.View.extend({

    events : {
        "click #header_profile": "account"
    },

    initialize: function() {
        _.bindAll(this, 'render');
    },

    render: function() {
        var source   = $("#appView-template").html();
        var template = Handlebars.compile(source);
        $('#header').html(template);
        $('#logged_in').hide();
    },

    account: function() {
        App.router.navigate("account", true);
    }
});

