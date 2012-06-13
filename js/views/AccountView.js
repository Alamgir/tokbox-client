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

        var access_token = $.jStorage.get("access_token");
        if (typeof App.user == 'undefined' && access_token) {
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8080/users/sign_in',
                data: access_token,
                dataType: 'json',
                statusCode: {
                    400 : function(jqXHR, textStatus, errorThrown) {
                        $.jStorage.deleteKey("access_token");
                        App.router.navigate("");
                    },
                    200 : function(data) {
                        App.user = data.user;
                        App.file_data = data.entity;
                        this.view.render();
                    }
                }
            });
        }


    },

    render: function() {
        //Pass in the user to the account info template
        //Pass in the file info to the file_view template
        var source   = $("#main-template").html();
        var template = Handlebars.compile(source);
        $('body').html(template);

        $('#about').hide();

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