define([
    'controller/home',
    'controller/message',
    'controller/menu',
    'helpers/function',
    'model/user'
], function (homeC,messageC,menuC,functionH,user) {


    var loadView = function (view, next) {
        user.isLogged(function(logged){
            if(logged){
                $.get('../templates/menu-logged.html', function (data) {
                    $('#menu').html(data);
                    menuC.logged();
                });
            }else{
                $.get('../templates/menu-nonlogged.html', function (data) {
                    $('#menu').html(data);
                    menuC.nonlogged();
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
            "message":"message",
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
        message:function(){
            functionH.isConnected( function(isConnected){
                if(isConnected){
                    loadView('message', function () {
                    messageC.init();
                    });
                }else{
                    loadView('message', function () {
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