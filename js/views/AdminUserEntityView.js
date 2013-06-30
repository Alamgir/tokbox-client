var AdminUserEntityView = Backbone.View.extend({
    
    attributes: {
    },

    events : {
                "change .approve_switch": "approve_user"
    },

    initialize: function() {
        _.bindAll(this, 'render');

        //initialize the view with the passed model
        this.$el.html( App.template.admin_entity_user(this.model) );
    },

    render: function() {                      
        this.options.admin_light_users_list.append(this.$el);

        var user = this.model;
        var light = this.options.approval_light;

        _.each(user.lights, function(user_light) {
            if (user_light.id === light.id) {
                var approval_state = user_light.user_approved;
                this.$el.find('.approve_switch').val(approval_state.toString());
            }
        }, this);

//        if (typeof user.lights[light.id] !== "undefined") {
//            var approval_state = user.lights[light.id].user_approved;
//            this.$el.find('.approve_switch').val(approval_state.toString());
//        }
//        else
//            this.$el.find('.approve_switch').val("false");


        this.delegateEvents();

        return this;
    },
    
    approve_user: function(event) {
        //uncollapse the element
        
        //what is the user's current state with this light?
        var user = this.model;
        var approval_light = this.options.approval_light;

        var approving_light = {};
        var current_approved_state = false;

        _.each(user.lights, function(user_light) {
            if (user_light.id === approval_light.id) {
                approving_light = user_light;
                current_approved_state = user_light.user_approved;
            }
        }, this);


        var new_approved_state = ( $(event.currentTarget).val() === "true" );

        if (new_approved_state !== current_approved_state) {

            var user_light_copy = user.lights.slice(0);

            if (_.isEmpty(approving_light)) {
                user_light_copy.push(approving_light);
                approving_light.id = approval_light.id;
            }

            approving_light.user_approved = new_approved_state;




            $.ajax({
                type: "POST",
                url: 'http://localhost:8080/users/'+ user.id + '/approve_user',
                data: JSON.stringify({
                    lights_approval : user_light_copy
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
                        $(event.currentTarget).val(current_approved_state.toString());

                        approving_light.user_approved = current_approved_state;
                    },
                    200: function(data) {

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
                            message: username + " is now " + state_text + " for " + light.name + "!"
                        });

                        //update the UI to show the user is approved
                        $(event.currentTarget).val(new_approved_state.toString());

                    }
                }
            });
        }
        else {
            $(event.currentTarget).val(current_approved_state.toString());

        }
        
    }

});