var AdminView = Backbone.View.extend({
    
    attributes: {
        "style" : "height:100%",
        "id"    : "admin_container"
    },

    events : {
        //"click #admin_save_button": "save_state"
    },

    initialize: function() {
        _.bindAll(this, 'render'
                        //"approve_user",
                        //"save_state"
                                    );

        this.light_views = [];

        this.$el.html(App.template.admin);
    },

    render: function() {

        if (App.user.admin) {
            $('#main_view').html(this.$el);

            var first_render = _.isEmpty(this.light_views);

            _.each(App.hue_data.lights, function(light, indx) {
                if (first_render) {
                    var light_view = new AdminLightEntityView({
                        model : light,
                        admin_light_list : $('#admin_light_list')
                    });
                    this.light_views.push(light_view);
                }
                else {
                    var view_in_array = this.light_views[indx];
                    view_in_array.model = light;
                    view_in_array.options.admin_light_list = $('#admin_light_list');
                }
            }, this);

            //render everything in the views array
            _.each(this.light_views, function(light_view) {
                light_view.render();
            }, this);


            this.delegateEvents();
            return this;
        }
        else {
            App.router.navigate("home", true);
        }
        

        
    }
    
    
    
});