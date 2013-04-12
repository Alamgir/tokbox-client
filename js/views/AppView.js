/**
 * Created with JetBrains WebStorm.
 * User: Alamgir
 * Date: 5/9/12
 * Time: 1:21 AM
 * To change this template use File | Settings | File Templates.
 */
var AppView = Backbone.View.extend({
    attributes: {
        id: "header_base"
    },

    events : {
        "click #header_profile": "account"
    },

    initialize: function() {
        _.bindAll(this, 'render');
        
        this.$el.html(App.template.app_view)
    },

    render: function() {
        $('#header').html(this.$el);
    },
    
    logged_in: function() {
        this.$el.html(App.template.app_view(App.user));
        this.render();
    },

    account: function() {
        App.router.navigate("account", true);
    }
});

