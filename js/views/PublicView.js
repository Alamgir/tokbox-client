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

        var source   = $("#publicView-template").html();
        var template = Handlebars.compile(source);
        $(this.el).html(template);
        $('#app').append(this.el);
    },

    render: function() {

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
                    window.location = "https://www.dropbox.com/1/oauth/authorize?oauth_token="+data.token+"&oauth_callback=http://localhost:83/auth";
                }
            }
        })
    },

    resume_auth: function() {
        //do whatever in the UI to show that auth is being completed
        var request_token = $.jStorage.get("request_token");
        var request_token_data = {request_token: request_token.token, request_secret: request_token.secret};
        var json_data = JSON.stringify(request_token_data);
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/users/auth',
            data: json_data,
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
    },

    login: function() {
        //we have the access token
        var access_token = $.jStorage.get("access_token");
        var access_token_data = {access_token: access_token.token, access_secret: access_token.secret};
        var json_data = JSON.stringify(access_token_data);
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/users/login',
            data: json_data,
            dataType: 'json',
            statusCode: {
                400 : function(jqXHR, textStatus, errorThrown) {
                    alert("Error getting access token");
                },
                200 : function(data) {
                    App.user = data.user_data;
                    App.access_token = data.access_token;
                    App.file_data = data.root_data;
                    App.router.navigate("home", true);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                var error = {
                    error: "true",
                    title: "Error Accessing Network",
                    message: "Whoops, something went wrong. Don't worry we're on it!"
                };
                alert_html = App.template.alert(error);
                $('#app').append(alert_html);
            }
        })
    }

});