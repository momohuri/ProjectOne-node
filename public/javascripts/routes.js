define([
    'controller/home',
    'helpers/function'
], function (homeC,functionH) {


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
            functionH.isConnected();
            loadView('home', function () {
                homeC.init();
            });
        },
        defaultRoute:function () {
            loadView('home', function () {
                homeC.init();
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