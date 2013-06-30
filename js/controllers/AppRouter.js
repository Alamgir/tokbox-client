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
        "auth":                 "auth",
        "home":                 "home",
        "path/*path":            "path",
        "login":                "login",
        "admin":                "admin"
    },

    views: {},

    initialize: function(options) {
        _.bindAll(this, "index", "auth", "home", "setBody");

        this.views.app = new AppView();
        this.views.pub = new PublicView();
        this.views.home = new HomeView();
        this.views.admin = new AdminView();

        this.view = this.views.app;
        this.view.render();

        this.route(/^auth?(.*)$/, "auth");

    },

    index: function() {
        
        var user = $.jStorage.get("user");
        if (!user) {
            this.setBody(this.views.pub);
            this.view.body.render();
        }
        else {
            this.navigate("home", true);
        }

    },

    auth: function(params) {
        this.setBody(this.views.pub, false);
        this.view.body.render();
        this.view.body.resume_auth();
    },

    home: function() {
        this.setBody(this.views.home, true);
        this.view.body.render();
    },

    path: function(path) {
        this.views.home.path(path);
        //this.setBody(this.views.home, true);
        //this.view.body.render();
    },

    login: function() {
        this.setBody(this.views.pub);
        this.view.body.render();
        this.view.body.login();
    },

    admin : function() {
        if (App.user.admin) {
            this.setBody(this.views.admin);
            this.view.body.render();
        }
        else this.navigate("", true);
    },

    setBody: function(view, auth) {
        if (auth == true && typeof App.user == 'undefined') {
            //login
            this.navigate("login", true);
            return;
        }

        this.view.body = view;
    }
});