var LightEntityView = Backbone.View.extend({
    
    attributes: {
    },

    events : {
        "change .light_switch": "light_switch"
    },

    initialize: function() {
        _.bindAll(this, 'render', "light_switch");
        //initialize the view with the passed model
        this.$el.html( App.template.entity(this.model) );
    },

    render: function() {                      
        this.options.light_container.append(this.$el);
        this.$el.find('.light_switch').val(this.model.state.on.toString());
//        var admin_light_users_list = this.$el.find('.admin_light_users_list');
//
//        _.each(App.admin_data.users, function(user) {
//            var user_entity_view = new AdminUserEntityView({
//                                                                model : user,
//                                                                approval_light : this.model,
//                                                                admin_light_users_list : admin_light_users_list
//                                                           });
//            this.user_entity_views.push(user_entity_view);
//            user_entity_view.render();
//
//            // var user_html = App.template.admin_entity_user(user);
//            // var admin_users_list = $('.admin_light_entity #' + light.name + ' .admin_light_users_list');
//            // admin_users_list.append(user_html);
//
//            //get the user's state with the light, set it in UI
//            // var approval_state = user.lights[light.id].approved;
//            // $('.user_entity_heading #' + user.username + ' .approve_switch').val(approval_state);
//        });
                    
        this.delegateEvents();

        return this;
    },

    light_switch : function(event) {
        var light_id = this.model.id;
        var light_name = this.model.name;

        var current_light_state = this.model.state.on;

        var new_light_state = ($(event.currentTarget).val() === "true");


        if (new_light_state != current_light_state) {
            this.model.state.on = new_light_state;
            var request_url = 'http://' + App.server_url + '/users/' + App.user.id + '/set_light_state';
            $.ajax({
                type: "POST",
                url: request_url,
                data: JSON.stringify({lights : App.hue_data.lights}),
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
                        this.model.state.on = new_light_state;

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
    }

});