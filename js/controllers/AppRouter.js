/**
 * Created with JetBrains WebStorm.
 * User: Alamgir
 * Date: 5/9/12
 * Time: 1:12 AM
 * To change this template use File | Settings | File Templates.
 */
var AppRouter = Backbone.Router.extend({
    routes: {
        "":                     "index",
        "/auth":                "auth",
        "/account":             "account"
    },

    views: {},

    initialize: function() {
        _.bindAll(this, "index", "display_graph", "setBody");

        this.views.app = new AppView({ el : $('body') });
        this.views.pub = new PublicView();
        this.views.account = new AccountView();

        this.view = this.views.app;
        this.view.render();
    },

    index: function() {
        var access_token = $.jStorage.get("access_token");
        if (!access_token) {
            this.setBody(this.views.pub);
            this.view.render();
        }
        else {
            this.navigate("account", true);
        }


//        if (typeof App.user != 'undefined') {
//            this.navigate("account", true);
//        }
//        else {
//            this.setBody(this.views.app, false);
//            this.view.body.render();
//        }
    },
    auth: function() {
        this.setBody(this.views.pub, false);
        this.view.body.render();
        this.view.body.resume_auth();
    },
    account: function() {
        this.setBody(this.views.account, true);
        this.view.body.render();
    },

    setBody: function(view, auth) {
        if (auth == true && typeof App.user == 'undefined') {
            this.navigate("", true);
            return;
        }


        this.view.body = view;
    }
});