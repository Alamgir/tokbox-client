/**
 * Created by JetBrains WebStorm.
 * User: pufferman
 * Date: 6/12/12
 * Time: 8:14 PM
 * To change this template use File | Settings | File Templates.
 */
var PublicView = Backbone.View.extend({

    events : {
        "click #start":    "start_auth"
    },

    initialize: function() {
        _.bindAll(this, 'render', "start_auth", "resume_auth");

    },

    render: function() {
        var source   = $("#main-template").html();
        var template = Handlebars.compile(source);
        $('body').html(template);
    },

    start_auth: function() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/users/req_auth',
            dataType: 'json',
            statusCode: {
                500 : function(jqXHR, textStatus, errorThrown) {
                    alert("Error getting request token");
                },
                200 : function(data) {
                    App.request_token = data;
                    $.jStorage.set("request_token", data);
                    //redirect to dropbox with request_token in URL
                }
            }
        })
    },

    resume_auth: function() {
        //do whatever in the UI to show that auth is being completed
        var request_token = App.request_token;
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/users/auth',
            data: request_token,
            dataType: 'json',
            statusCode: {
                400 : function(jqXHR, textStatus, errorThrown) {
                    alert("Error getting access token");
                },
                200 : function(data) {
                    App.user = data.user;
                    App.access_token = data.access_token;
                    App.file_data = data.entity;
                    $.jStorage.set("access_token", data.access_token);
                    //redirect to account view with the data
                }
            }
        })
    }

});