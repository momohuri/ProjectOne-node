define([
    'controller/home'
], function (home) {


    var loadView = function (view, next) {
        ko.removeNode($('#into'));
        $.get('../templates/' + view + '.html', function (data) {
            $('#into').html(data);
            next();
        });
    }

    var AppRouter = Backbone.Router.extend({
        routes:{
            "inscription":"home",
            "*actions":"defaultRoute" // Backbone will try match the route above first
        },
        home:function () {
            loadView('home', function () {
                home.init();
            })
        },

        defaultRoute:function () {
            loadView('home', function () {
                home.init();
            });

        }
    });


    var app = {
        init:function () {
            var app_router = new AppRouter;
            Backbone.history.start();
        }
    }
    return app;

});