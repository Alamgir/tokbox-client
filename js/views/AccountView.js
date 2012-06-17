/**
 * Created by JetBrains WebStorm.
 * User: pufferman
 * Date: 6/12/12
 * Time: 8:09 PM
 * To change this template use File | Settings | File Templates.
 */
var AccountView = Backbone.View.extend({

    events : {
        "click #how_link":    "footer_link",
        "click #about_link":  "footer_link"
    },

    initialize: function() {
        _.bindAll(this, 'render');

    },

    render: function() {
        //Pass in the user to the account info template
        //Pass in the file info to the file_view template
        var source   = $("#accountView-template").html();
        var template = Handlebars.compile(source);
        $(this.el).html(template);
        $('#app').append(this.el);
    },

    footer_link: function() {
        $(window).scrollTo('100%', 500);

    },

    login: function() {




    },
    start: function() {
        var auth_request_data = Tokbox.req_token();
    }

});