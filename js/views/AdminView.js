var AdminView = Backbone.View.extend({
    
    attributes: {
        "style" : "height:100%"
    },

    events : {
        "change .approve_switch": "approve_user",
        "click #admin_save_button": "save_state"
    },

    initialize: function() {
        _.bindAll(this, 'render', "approve_user", "save_state");

        this.$el.html(App.template.admin);
        //$('#app').html(this.$el);
    },

    render: function() {
        
        
        $('#app').html(this.$el);

        if (App.user.admin) {
            //The user is an admin or is approved
            $('#admin_container').empty();
            var admin_data = App.admin_data;
            for (var i=0; i<admin_data.users.length; i++) {
                //add each light data to the App.admin_data.users.lights
                //for each light in App.admin_data.users[i].lights
                    //the light_id is App.admin_data.users[i].lights.id
                    //look up the light by id -> App.hue_data_lights[light_id]
                
                var user_html = App.template.admin_entity(admin_data.users[i]);
                $('#admin_container').append(user_html);
                
            }
        }
        else {
            //the user isn't an admin, get them the fuck out of here
            AppRouter.navigate("home", true);
        }
        
        this.delegateEvents();

        return this;
    },
    
    approve_user: function(event) {
        //uncollapse the element
        var username = $(event.currentTarget).parent.attr("username");
        
        $('#'+username+'_options').collapse('show');
        
        
    }
    
    
    
});