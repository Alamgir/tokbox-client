/**
 * Created with JetBrains WebStorm.
 * User: Alamgir
 * Date: 5/9/12
 * Time: 1:21 AM
 * To change this template use File | Settings | File Templates.
 */
var SidebarView = Backbone.View.extend({
    attributes: {
        id: "sidebar",
        class: "span2"
    },

    events : {
        "click .nav_lights": "lights",
        "click .nav_admin" : "admin"
    },

    initialize: function() {
        _.bindAll(this, 'render');
        
        this.$el.html(App.template.sidebar);
    },

    render: function() {
        if (App.user.admin) {
            //the user is an admin, render the admin button
            var admin_button_html = $('<div class="row sidebar_nav nav_admin"></div>');
           this.$el.append(admin_button_html);
        }

        $('#app_container').append(this.$el);
    },
    
    lights: function(event) {
        App.router.navigate("home", true);
        this.set_ui(event);

    },

    admin: function(event) {
        App.router.navigate("admin", true);
        this.set_ui(event)
    },

    set_ui: function(event) {
        $('.sidebar_nav').removeClass("selected");
        $(event.currentTarget).addClass("selected");
    },

    manually_set_ui: function(nav_type) {
        $('.sidebar_nav').removeClass("selected");
        $('.'+nav_type).addClass("selected");
    }
});

