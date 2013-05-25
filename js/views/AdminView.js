var AdminView = Backbone.View.extend({
    
    attributes: {
        "style" : "height:100%",
        "id"    : "admin_container"
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
        
        //************************ BEGIN NEW VIEW CODE HERE ************************************************
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
    },
    
    approve_user: function(event) {
        //uncollapse the element
        var username = $(event.currentTarget).parent.attr("username");
        var light_id = $(event.currentTarget).closest('.light_entity_heading').attr("light_id");
        //what is the user's current state with this light?
        var user = App.admin_data.users[username];
        var light = user.lights[light_id];
        
        var current_approved_state = light.approved;
        
        var new_approved_state = $(event.currentTarget).val();
        if (new_approved_state != current_approved_state) {
            $.ajax({
               type: "PUT",
               url: 'http://localhost:8080/admin/approve_user',
               data: JSON.stringify({
                                    user_id: user.id, 
                                    light_id: light_id,
                                    approved: new_approved_state
                                    }),
               dataType: 'json',
               statusCode: {
                   500 : function(jqXHR, textStatus, errorThrown) {
                       Tokbox.alert({
                           error: "true",
                           title: "Unsuccessful Operation",
                           message: "Couldn't switch the light state"
                       });
                       
                       //Reset the slider
                       $(event.currentTarget).val(current_approved_state);
                   },
                   200: function(data) {
                       user.lights[light_id].approved = new_approved_state;
                       
                       var state_text = "";
                       if (new_approved_state === true) {
                           state_text = "Approved";
                       }
                       else {
                           state_text = "Denied";
                       }
                       
                       
                       Tokbox.alert({
                           error: "success",
                           title: "Successful Operation",
                           message: username + " is now " + state_text + " from " + light.name + "!"
                       });
                       
                       //update the UI to show the light is on
                   }
               }
            });
        }
        
        $('#'+username+'_options').collapse('show');
        
        
    }
    
    
    
});