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
        this.views.sidebar = new SidebarView();
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
            //this is zero-state
            this.setBody(this.views.pub, false);
            this.view.body.render();
        }
        else {
            //this is a returning user
            this.resume(user.id);
        }

    },

    auth: function(params) {
        this.setBody(this.views.pub, false);
        this.view.body.render();
        this.view.body.resume_auth();
    },

    home: function() {
        if (this.setBody(this.views.home, true)) {
            //if the body is set successfully, go ahead with rendering
            this.view.body.render();
        }
    },

    path: function(path) {
        this.views.home.path(path);
        //this.setBody(this.views.home, true);
        //this.view.body.render();
    },

    login: function() {
        this.setBody(this.views.pub, false);
        this.view.body.render();
    },

    resume: function(user_id) {
        //a user is resuming their session
        //call get status on publicView
        //navigate to home
        if (this.views.pub.get_status(user_id)) {
            this.navigate("home", true);
        }
        else {
            this.navigate("login", true);
        }
    },

    admin : function() {
        this.setBody(this.views.admin, true);
        this.view.body.render();
    },

    setBody: function(view, auth) {
        if (auth === true && typeof App.user === 'undefined') {
            //this is zero state

            //check if the user is stored
            var user = $.jStorage.get("user");
            if (!user) {
                //if the user isn't stored, redirect to login
                this.navigate("login", true);
                // return false to signify failure to "view"
                return false;
            }
            else if (this.views.pub.get_status(user.id) === false) {
                //if the user is stored, getStatus and go to the view
                return false;
            }
        }

        this.view.body = view;
        //return true to signify that "view" should continue
        return true;
    }
});