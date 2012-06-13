/**
 * Created with JetBrains WebStorm.
 * User: Alamgir
 * Date: 5/9/12
 * Time: 1:21 AM
 * To change this template use File | Settings | File Templates.
 */
var AppView = Backbone.View.extend({

    events : {
        "click #how_link":    "footer_link",
        "click #about_link":  "footer_link",
        "click #start":       "start_auth"
    },

    initialize: function() {
        _.bindAll(this, 'render');
    },

    render: function() {
        var source   = $("#main-template").html();
        var template = Handlebars.compile(source);
        $('body').html(template);

        $('#about').hide();

    },

    footer_link: function() {
        $(window).scrollTo('100%', 500);
        
    }

});

