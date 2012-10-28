define([
    'controller/home',
    'controller/message',
    'controller/event',
    'controller/menu',
    'helpers/function',
    'model/user'
], function (homeC, messageC, eventC, menuC, functionH, user) {


    var loadView = function (view, next) {
        $.get('templates/menu-nonlogged.html', function (data) {
            $('#menu').html(data);
            menuC.nonlogged();
        }, 'html');
        ko.removeNode($('#into'));
        $.get('templates/' + view + '.html', function (data) {
            $('#into').html(data);
            next();
        }, 'html');
    }

    var loadViewOnOffline=function(view,next){
        $.get('templates/menu-nonlogged.html', function (data) {
            $('#menu').html(data);
            menuC.nonlogged();
        }, 'html');
        ko.removeNode($('#into'));
        $.get('templates/' + view + '.html', function (data) {
            $('#into').html(data);
            next();
        }, 'html');
    }

    var loadViewLogged = function (view, next) {
        user.isLogged(function (logged) {
            if (logged) {
                $.get('templates/menu-logged.html', function (data) {
                    $('#menu').html(data);
                    menuC.logged();
                }, 'html');
                ko.removeNode($('#into'));
                $.get('templates/' + view + '.html', function (data) {
                    $('#into').html(data);
                    next();
                }, 'html');
            } else {
                window.location.hash='';
            }
        });
    }

    var AppRouter = Backbone.Router.extend({
        routes:{
            "inscription":"home",
            "message":"message",
            "event":"event",
            "*actions":"defaultRoute" // Backbone will try match the route above first
        },
        home:function () {
            functionH.isConnected(function (isConnected) {
                if (isConnected) {
                    loadView('home', function () {
                        homeC.init();
                    });
                } else {
                    loadView('home-offline', function () {
                    });
                }
            });

        },
        message:function () {
                    loadViewLogged('message', function () {
                        messageC.init();
                    });
        },
        event:function () {
                loadViewLogged('event', function () {
                    eventC.init();
                });
        },
        defaultRoute:function () {
            functionH.isConnected(function (isConnected) {
                if (isConnected) {
                    loadView('home', function () {
                        homeC.init();
                    });
                } else {
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