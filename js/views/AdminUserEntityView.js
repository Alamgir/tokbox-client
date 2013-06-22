var AdminUserEntityView = Backbone.View.extend({
    
    attributes: {
    },

    events : {
                "change .approve_switch": "approve_user"
    },

    initialize: function() {
        _.bindAll(this, 'render');
        
        this.user_entity_views = [];
        
        //initialize the view with the passed model
        this.$el.html( App.template.admin_entity_user(this.model) );
    },

    render: function() {                      
        this.options[admin_light_users_list].append(this.$el);
                    
        //get the user's state with the light, set it in UI
        var approval_state = user.lights[light.id].approved;
        $('.user_entity_heading #' + user.username + ' .approve_switch').val(approval_state);
                    
        this.delegateEvents();

        return this;
    },
    
    approve_user: function(event) {
        //uncollapse the element
        
        //what is the user's current state with this light?
        var user = this.model;
        var approval_light = this.options[approval_light];
        
        var current_approved_state = user.lights[approval_light.id].approved;
        
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
                       user.lights[approval_light.id].approved = new_approved_state;
                       
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
                       
                       //update the UI to show the user is approved
                       $(event.currentTarget).val(new_approved_state);
                       
                   }
               }
            });
        }
        
        $('#'+username+'_options').collapse('show');
        
        
    }

});