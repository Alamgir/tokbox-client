var AdminLightEntityView = Backbone.View.extend({
    
    attributes: {
    },

    events : {
        
    },

    initialize: function() {
        _.bindAll(this, 'render');
        
        this.user_entity_views = [];
        
        //initialize the view with the passed model
        this.$el.html( App.template.admin_entity_light(this.model) );
    },

    render: function() {                      
        this.options[admin_light_list].append(this.$el);
        
        var admin_light_users_list = this.$el.find('.admin_light_users_list');
          
        _.each(App.admin_data.users, function(user) {
            var user_entity_view = new AdminUserEntityView({
                                                                model : user,
                                                                approval_light : this.model,
                                                                admin_light_users_list : admin_light_users_list
                                                           });
            this.user_entity_views.push(user_entity_view);
            user_entity_view.render();
            
            // var user_html = App.template.admin_entity_user(user);  
            // var admin_users_list = $('.admin_light_entity #' + light.name + ' .admin_light_users_list');
            // admin_users_list.append(user_html);
            
            //get the user's state with the light, set it in UI
            // var approval_state = user.lights[light.id].approved;
            // $('.user_entity_heading #' + user.username + ' .approve_switch').val(approval_state);
        });
                    
        this.delegateEvents();

        return this;
    }

});