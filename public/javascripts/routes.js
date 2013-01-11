define([
    'controller/home',
    'controller/message',
    'controller/event',
    'controller/menu',
    'controller/inscription',
    'controller/eventDescription',
    'helpers/function',
    'model/user'
], function (homeC, messageC, eventC, menuC, inscriptionC, eventDescriptionC, functionH, user) {

        var AppRouter = Backbone.Router.extend({
            routes:{
                "message":"message",
                "createEvent":"createEvent",
                "inscription":"inscription",
                "searchEvent":"searchEvent",
                "eventDescription/:id":"eventDescription",
                "*actions":"defaultRoute"
            },
            message:function () {
                loadViewLogged('message', function () {
                    messageC.init();
                });
            },
            createEvent:function () {
                loadViewLogged('event', function () {
                    eventC.init();
                });
            },
            searchEvent:function () {
                loadViewOnOffnoMenu('searchEvent', function (online) {
                    if (online) {
                        homeC.init();
                    }
                })
            },
            inscription:function () {
                loadViewOnOffline('inscription', function (online) {
                        if (online) {
                            inscriptionC.init();
                        }
                    }
                )
            },
            eventDescription:function (id) {
                loadView('eventDescription', function (online) {
                        eventDescriptionC.init(id);
                });
            },
            defaultRoute:function () {
                loadViewOnOffnoMenu('searchEvent', function (online) {
                    if (online) {
                        homeC.init();
                    }
                });
            }
        });


//vue qui n a pas besoin d etre logger et c la meme on et offline
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

        //vue quand on a pas logger et qui affiche ou une vue online ou une vue offline
        var loadViewOnOffline = function (view, next) {
            $.get('templates/menu-nonlogged.html', function (data) {
                $('#menu').html(data);
                menuC.nonlogged();
            }, 'html');
            ko.removeNode($('#into'));
            functionH.isConnected(function (isConnected) {
                if (isConnected) {
                    $.get('templates/online/' + view + '.html', function (data) {
                        $('#into').html(data);
                        next({online:true});
                    }, 'html');
                } else {
                    $.get('templates/offline/' + view + '.html', function (data) {
                        $('#into').html(data);
                        next({online:false});
                    }, 'html');
                }
            });
        }
//vue quand on a est logger meme vue on ou offline
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
                    window.location.hash = '';
                }
            });
        }

//vue logger et qui affiche ou une vue online ou une vue offline
        var loadViewloggerOnOffline = function (view, next) {
            user.isLogged(function (logged) {
                if (logged) {
                    $.get('templates/menu-logged.html', function (data) {
                        $('#menu').html(data);
                        menuC.nonlogged();
                    }, 'html');
                    ko.removeNode($('#into'));
                    functionH.isConnected(function (isConnected) {
                        if (isConnected) {
                            $.get('templates/online/' + view + '.html', function (data) {
                                $('#into').html(data);
                                next({online:true});
                            }, 'html');
                        } else {
                            $.get('templates/offline/' + view + '.html', function (data) {
                                $('#into').html(data);
                                next({online:false});
                            }, 'html');
                        }
                    });
                } else {
                    window.location.hash = '';
                }
            });
        }

        //meme page mais menu different
        var loadViewOnOffnoMenu=function(view,next){
            user.isLogged(function (logged) {
                if (logged) {
                    $.get('templates/menu-logged.html', function (data) {
                        $('#menu').html(data);
                        menuC.nonlogged();
                    }, 'html');
                }else{
                    $.get('templates/menu-nonlogged.html', function (data) {
                        $('#menu').html(data);
                        menuC.nonlogged();
                    }, 'html');
                }
            });

            ko.removeNode($('#into'));
            functionH.isConnected(function (isConnected) {
                if (isConnected) {
                    $.get('templates/online/' + view + '.html', function (data) {
                        $('#into').html(data);
                        next({online:true});
                    }, 'html');
                } else {
                    $.get('templates/offline/' + view + '.html', function (data) {
                        $('#into').html(data);
                        next({online:false});
                    }, 'html');
                }
            });
        }



        var app = {
            init:function () {
                var app_router = new AppRouter;
                Backbone.history.start();
            }
        }
        return app;
    }



)
;