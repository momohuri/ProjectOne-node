define([
    '../helpers/dao',
    "../helpers/function"

], function (dao, functionH) {

    var user = new Backbone.Model(
        {
            Name:'',
            Surname:'',
            Email:'',
            Password:'',
            Birthday:'',
            Img:''
        });


    var app = {
        init:function (form) {
            var view_model = kb.viewModel(user);
            ko.applyBindings(view_model, $('#' + form)[0]);
            return view_model;
        },
        create:function (model) {
            dao.QueryOnline('addUser', model.model().attributes,
                function (res) {
                    functionH.alert("inscription", res.err);
                });

        },
        isLogged:function (next) {
            if (sessionStorage.getItem('id') != null) {
                next(true);
            } else {
                next(false);
            }
        },
        login:function (user, password) {
            functionH.isConnected(function (online) {
                if (online) {
                    dao.QueryOnline('UserConnect', {user:user, password:password},
                        function (res) {
                            if (res.work) {
                                sessionStorage.setItem('id', res.id);
                                dao.createOffline(function () {
                                    dao.InsertOffline('user', {Email:user, Password:password}, function () {
                                        console.log('log and clear')
                                    });
                                });

                            } else {
                                functionH.alert("login", res.err);
                            }
                        });
                } else {
                    dao.createOffline(function () {
                        dao.QueryOffline('user', {Email:user, Password:password}, function (res) {
                            if (res.length != 0) {
                                //todo make offline id session
                                sessionStorage.setItem('id', 'idOffline');
                            } else {
                                console.log('bad password');
                            }
                        })
                    });
                }
            });
        },
        unlogue:function () {
            functionH.isConnected(function (online) {
                if (online) {
                    dao.QueryOnline('UserDisconect', {id:window.sessionStorage.id},
                        function (res) {
                            window.sessionStorage.removeItem('id')
                        });
                } else {
                    dao.QueryOffline('user', {Email:user, Password:password}, function (res) {
                        if (res.length != 0) {
                            //todo make offline id session
                            sessionStorage.setItem('id', 'idOffline');
                        } else {
                            console.log('bad password');
                        }
                    });
                }
            });

        }

    }
    return app;

});