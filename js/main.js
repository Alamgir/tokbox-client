/**
 * Created with JetBrains WebStorm.
 * User: Alamgir
 * Date: 5/7/12
 * Time: 11:22 PM
 * To change this template use File | Settings | File Templates.
 */

if (!Tokbox) {
    var Tokbox = {};
}

Tokbox.alert = function(alert_type) {
    $('.alert').remove();
    var alert_html = App.template.alert(alert_type);
    $('#app').append(alert_html);
    $('.alert').hide().fadeIn('slow').delay(2000).fadeOut('slow');
};

var App = {
    initialize: function() {

        $.ajaxSetup({
            xhrFields: {
                withCredentials: true
            }
        });

        var sync = Backbone.sync;
        Backbone.sync = function(method, model, options) {
            options.error = function(xhr, ajaxOptions, thrownError) {
                if (xhr.status == 401) {
                    window.location = '/';
                }
            };
            sync(method, model, options);
        };

        this.template = {};

        var main_view_source = $('#mainView-template').html();
        this.template.main = Handlebars.compile(main_view_source);

        var entity_template_source   = $("#entityView-template").html();
        this.template.entity = Handlebars.compile(entity_template_source);

        var alert_template_source = $('#alertView-template').html();
        this.template.alert = Handlebars.compile(alert_template_source);

        this.router = new AppRouter();
        Backbone.history.start({pushState: true});








    }
};


