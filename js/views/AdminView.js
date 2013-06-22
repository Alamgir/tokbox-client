var AdminView = Backbone.View.extend({
    
    attributes: {
        "style" : "height:100%",
        "id"    : "admin_container"
    },

    events : {
        "click #admin_save_button": "save_state"
    },

    initialize: function() {
        _.bindAll(this, 'render', "approve_user", "save_state");

        this.$el.html(App.template.admin);
        //$('#app').html(this.$el);
    },

    render: function() {
        
        
        $('#app').html(this.$el);
            
        //The user is an admin or is approved            
        if (App.user.admin) {
            
            // append each light to the admin_light_list
            _.each(App.hue_data.lights, function(light) {
                var light_html = App.template.admin_entity_light(light);
                $('#admin_light_list').append(light_html);
                   
                _.each(App.admin_data.users, function(user) {
                    var user_html = App.template.admin_entity_user(user);  
                    var admin_users_list = $('.admin_light_entity #' + light.name + ' .admin_light_users_list');
                    admin_users_list.append(user_html);
                    
                    //get the user's state with the light, set it in UI
                    var approval_state = user.lights[light.id].approved;
                    $('.user_entity_heading #' + user.username + ' .approve_switch').val(approval_state);
                });
            });
            
            //append each user to each light, also check the user's current approval with the light
            
        }
        else {
            //the user isn't an admin, get them the fuck out of here
            AppRouter.navigate("home", true);
        }
        
        this.delegateEvents();    
        
        //******************************************* BEGIN NEW VIEW CODE HERE ************************************************
        // add to initialize
        /*
        this.light_views = [];
        
        _.each(App.hue_data.lights, function(light) {
           var light_view = new AdminLightEntityView({
                                                        model : light,
                                                        admin_light_list : $('#admin_light_list')
                                                    });
            this.light_views.push(light_view);
            light_view.render();
        });
        */
        
        return this;
    }
    
    
    
});