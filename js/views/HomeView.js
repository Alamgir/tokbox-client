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
        "click .filecrumb":     "breadcrumb"
    },

    initialize: function() {
        _.bindAll(this, 'render', "path", "breadcrumb", "set_breadcrumbs");

        this.$el.html(App.template.main);
        $('#app').html(this.$el);
    },

    render: function() {
        //Pass in the user to the account info template
        //Pass in the file info to the file_view template
        //var entity_template_source   = $("#entityView-template").html();
        //var entity_template = Handlebars.compile(entity_template_source);
        //var main_view_source = $("#mainView-template").html();
        //var template_main_view = Handlebars.compile(main_view_source);


        $('#app').html(this.$el);
        $('#file_container').empty();
        var file_data = App.file_data;
        for (var i=0; i<file_data.contents.length; i++) {
            var file_html = App.template.entity(file_data.contents[i]);
            $('#file_container').append(file_html);
        }

        this.set_breadcrumbs();

        //var template = Handlebars.compile(source);
        //$(this.el).html(template);
        //$('#app').append(this.el);
        this.delegateEvents();

        return this;
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
