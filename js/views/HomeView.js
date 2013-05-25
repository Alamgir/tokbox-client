/**
 * Created by JetBrains WebStorm.
 * User: pufferman
 * Date: 6/12/12
 * Time: 8:09 PM
 * To change this template use File | Settings | File Templates.
 */
var HomeView = Backbone.View.extend({

    attributes: {
        "style" : "height:100%"
    },

    events : {
        "click .file_entity":   "file_entity",
        "click .filecrumb":     "breadcrumb",
        "change .light_switch": "light_switch"
    },

    initialize: function() {
        _.bindAll(this, 'render', "path", "breadcrumb", "set_breadcrumbs");

        this.$el.html(App.template.main);
        //$('#app').html(this.$el);
    },

    render: function() {
        
        
        $('#app').html(this.$el);

        if (App.user.approved || App.user.admin) {
            //The user is an admin or is approved
            $('#light_container').empty();
            var light_data = App.hue_data.lights;
            for (var i=0; i<light_data.length; i++) {
                var light_html = App.template.entity(light_data[i]);
                $('#light_container').append(light_html);
            }
            
            if (App.user.admin) {
                //the user is an admin, render the admin button
                var admin_button_html = $('<button id="admin_save_button">Save Changes</button>');
                $('#light_container').append(admin_button_html);
            }
            
        }
        else {
            //indicate that the user has yet to be approved, render the awaiting approval message
            
        }
        
        this.delegateEvents();

        return this;
    },
    
    light_switch: function(event) {
        var light_id = $(event.currentTarget).parent.attr("light_id");
        var light_name = $(event.currentTarget).parent.attr("light_name");
        
        var current_light_state = App.hue_data.lights[light_id-1].state.on;
        
        var new_light_state = $(event.currentTarget).val();
        if (new_light_state != current_light_state) {
            $.ajax({
               type: "PUT",
               url: 'http://localhost:8080/lights/switch',
               data: JSON.stringify({light_state: new_light_state}),
               dataType: 'json',
               statusCode: {
                   500 : function(jqXHR, textStatus, errorThrown) {
                       Tokbox.alert({
                           error: "true",
                           title: "Unsuccessful Operation",
                           message: "Couldn't switch the light state"
                       });
                       
                       //Reset the slider
                       $(event.currentTarget).val(current_light_state);
                   },
                   200: function(data) {
                       App.hue_data.lights[light_id-1].state.on = new_light_state;
                       
                       var state_text = "";
                       if (new_light_state === true) {
                           state_text = "on";
                       }
                       else {
                           state_text = "off";
                       }
                       
                       
                       Tokbox.alert({
                           error: "success",
                           title: "Successful Operation",
                           message: light_name + " is now " + state_text + "!"
                       });
                       
                       //update the UI to show the light is on
                   }
               }
            });
        }
        
    },
    
    refresh_user: function() {
        //We already had the user in jStorage, so we're just refreshing from the server
        //the server should have the client authenticated already with a session cookie
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/users/info',
            dataType: 'json',
            statusCode: {
                400 : function(jqXHR, textStatus, errorThrown) {
                    Tokbox.alert({
                        error:"true",
                        title:"Bad Login",
                        message:"You haven't logged in yet!"
                    });
                },
                200 : function(data) {
                    App.user = data.user_data;
                    App.hue_data = data.hue_data;
                    $.jstorage.set("user", data.user_data);
                    $.jstorage.set("hue", data.hue_data);

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
    },

    file_entity: function(event) {
        var path = $(event.currentTarget).attr("path");
        var type = $(event.currentTarget).attr("type");
        alert(path);


        if (type === "folder_app" || type === "folder_gray" || type === "folder_photos" || type === "folder_public"
            || type === "folder_star" || type === "folder_user" || type == "folder") {
            App.router.navigate('path/'+path, true);
        }
        else {
            alert("You can't go further into a file!");
        }

        //this.path($(event.currentTarget).attr("path"));
    },

    breadcrumb: function(event) {
        var path = $(event.currentTarget).attr("path");
        alert(path);

        if (path) {
            App.router.navigate('path/'+path, true);
        }
    },

    path: function(path) {
        var data = {path: path};
        $.ajax({
            async: 'false',
            type: 'GET',
            url: 'http://localhost:8080/users/metadata',
            data: data,
            dataType: 'json',
            statusCode: {
                500 : function(jqXHR, textStatus, errorThrown) {
                    alert("Error getting metadata");
                },
                200 : function(data) {
                    App.file_data = data;

                    App.router.setBody(App.router.views.home, true);
                    App.router.view.body.render();
                }
            }
        });
    },

    set_breadcrumbs: function() {
        //gather the necessary parts of the path into an array
        $('.filecrumb_list').empty();
        var file_data = App.file_data;
        var root = [file_data.root];
        var crumb_array = root.concat(file_data.path.split("/"));
        var path_string = "";
        for(var i=0; i<crumb_array.length; i++) {
            var list_item = $('<li class="filecrumb">'+crumb_array[i]+'</li>');
            if (crumb_array[i] !== "") {
                //build the path for this current breadcrumb
                path_string = path_string + crumb_array[i] + "/";
                list_item.attr('path', path_string);
                $('#breadcrumbs .filecrumb_list').append(list_item);
                if (file_data.path !== "/" && i < crumb_array.length-1) {
                    $('#breadcrumbs .filecrumb_list').append('<li class="filecrumb_arrow"></li>');
                }
            }
        }


        //use the template to spell out the UL list
        //update the view for the breadcrumbs
    }

});
