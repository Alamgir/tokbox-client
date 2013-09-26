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
        "click #admin_button":  "admin"
    },

    initialize: function() {
        _.bindAll(this, 'render', "path", "breadcrumb", "set_breadcrumbs");

        this.entity_views = [];

        this.$el.html(App.template.main);
    },

    render: function() {

        $('#main_view').html(this.$el);

        var approved_ids = [];
        if (!App.user.admin) {
            _.each(App.user.lights, function(light) {
                if (light.user_approved) {
                    approved_ids.push(light.id);
                }
            }, this);
        }
        else {
            _.each(App.hue_data.lights, function(light) {
                approved_ids.push(light.id);
            }, this);
        }


        //is this the first time we're rendering?
        var first_render = _.isEmpty(this.entity_views);

        if (!first_render) {
            //adjust views_array to match # of models
            App.reuse_views(this.entity_views, _.size(approved_ids));
        }

        //build only the approved views
        if (!_.isEmpty(approved_ids) || App.user.admin) {
            var indx = 0;
            _.each(App.hue_data.lights, function(light) {
                //only create the view if the user is approved for this light
                if (_.contains(approved_ids, light.id) || App.user.admin) {
                    if (first_render) {
                        var light_view = new LightEntityView({
                            model : light,
                            light_container : $('#light_container')
                        });
                        this.entity_views.push(light_view);
                    }
                    //else assign model to the index of the views array
                    else {
                        var view_in_array = this.entity_views[indx];
                        view_in_array.model = light;
                        view_in_array.options.light_container = $('#light_container');
                        indx++;
                    }
                }
            }, this);

            //render everything in the views array
            _.each(this.entity_views, function(light_view) {
                light_view.render();
            }, this);


        }
        else {
            //indicate that the user has yet to be approved, render the awaiting approval message

        }

        this.delegateEvents();

        App.router.views.sidebar.manually_set_ui("nav_lights");

        return this;
    },

    admin : function() {
        App.router.navigate('admin', true);
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
    },

    rerender : function(view_array, num_models) {
        var size_diff = _.size(view_array) - num_approved_ids;

        //size > 0 means that there more views than necessary

        //size < 0 means that there are fewer views than necessary

    }

});
