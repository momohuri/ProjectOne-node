define([
    'controller/home',
    'helpers/function',
    'model/user'
], function (homeC,functionH,user) {


    var loadView = function (view, next) {
        user.isLogged(function(logged){
            if(logged){
                $.get('../templates/menu-connected.html', function (data) {
                    $('#menu').html(data);
                });
            }else{
                $.get('../templates/menu-disconnected.html', function (data) {
                    $('#menu').html(data);
                });
            }
        });
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
            functionH.isConnected( function(isConnected){
                if(isConnected){
                    loadView('home', function () {
                    homeC.init();
                    });
                }else{
                    loadView('home-offline', function () {
                    });
                }
            });

        },
        defaultRoute:function () {
            functionH.isConnected( function(isConnected){
                if(isConnected){
                    loadView('home', function () {
                        homeC.init();
                    });
                }else{
                    loadView('home-offline', function () {
                    });
                }
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