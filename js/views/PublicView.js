/**
 * Created by JetBrains WebStorm.
 * User: pufferman
 * Date: 6/12/12
 * Time: 8:14 PM
 * To change this template use File | Settings | File Templates.
 */
var PublicView = Backbone.View.extend({

    events : {
        "click #login_button":    "login"
    },

    initialize: function() {
        _.bindAll(this, 'render', "login", "get_status");

        this.$el.html(App.template.public);
        //$('#app').html(this.el);
    },

    render: function() {
        $('#app_container').html($(this.el));
        this.delegateEvents();
        return this;
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
        var username = $('#username_val').val();
        var password = $('#password_val').val();
        if (username != "" && password != "") {
            var login_data = JSON.stringify({username:username,password:password});
            $.ajax({
                type: 'POST',
                url: 'http://' + App.server_url + '/users/login',
                data: login_data,
                dataType: 'json',
                statusCode: {
                    400 : function(jqXHR, textStatus, errorThrown) {
                        Tokbox.alert({
                            error:"true",
                            title:"Bad Login",
                            message:"Wrong Credentials"
                        });
                    },
                    200 : function(data) {
                        //add back the main view
                        $('#app_container').html($('<div id="main_view" class="span10"></div>'));

                        var user_data = data.user_data;
                        var hue_data = data.hue_data;

                        App.user = user_data;
                        App.hue_data = hue_data;

                        $.jStorage.set("user", user_data);
                        $.jStorage.set("hue", hue_data);

                        App.router.views.sidebar.render();
                        App.router.navigate("home", true);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    var error = {
                        error: "true",
                        title: "Error Accessing Network",
                        message: "Whoops, something went wrong. Don't worry we're on it!"
                    };
                    Tokbox.alert(error);
                }
            });
        }
        else {
            Tokbox.alert({
                error:"true",
                title:"Missing Info",
                message:"You left one of the fields blank."
            });
        }

    },

    get_status: function(user_id) {
        $.ajax({
            async: false,
            type: 'GET',
            url: 'http://' + App.server_url + '/users/' + user_id,
            dataType: 'json',
            statusCode: {
                400 : function(jqXHR, textStatus, errorThrown) {
                    Tokbox.alert({
                        error:"true",
                        title:"Bad Login",
                        message:"User isn't admin"
                    });
                }

            },
            error: function(jqXHR, textStatus, errorThrown) {
                var error = {
                    error: "true",
                    title: "Error Accessing Network",
                    message: "Whoops, something went wrong. Don't worry we're on it!"
                };
                Tokbox.alert(error);
                return false;
            },
            success: function(data, textStatus, jqXHR) {
                //add back the main view
                $('#app_container').html($('<div id="main_view" class="span10"></div>'));

                var user_data = data.user_data;
                var hue_data = data.hue_data;

                App.user = user_data;
                App.hue_data = hue_data;

                $.jStorage.set("user", user_data);
                $.jStorage.set("hue", hue_data);
                return true;
            }
        });
    }

});