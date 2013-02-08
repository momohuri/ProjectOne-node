define([
    '../helpers/dao',
    "../helpers/function"
], function (dao, functionH) {

    var user = new Backbone.Model(
        {
            id: '',
            Name:'',
            Surname:'',
            Email:'',
            Password:'',
            Birthday:'',
            IsLogged:'',
            IsCreator:'',
            IsMember:'',
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
                    if(res.work == true ){
                        window.location.hash = 'searchEvent';
                    }else{
                        functionH.alert("inscription", res.err);
                     }
                });

        },
        isLogged:function (next) {
            if (localStorage.getItem('id') != null) {
                user.set("IsLogged",true);
                next(true);
            } else {
                user.set("IsLogged",false);
                next(false);
            }
        },
        login:function (user, password) {
            functionH.isConnected(function (online) {
                if (online) {
                    dao.createOffline(function () {
                    });
                    //todo faire quelque chose ici....
                    dao.QueryOnline('UserConnect', {user:user, password:password},
                        function (res) {
                            if (!res.err) {
                                localStorage.setItem('id', res.id);
                                localStorage.setItem('userId', res.userId);
                                localStorage.setItem('name', res.Name);
                                localStorage.setItem('surname', res.Surname);
                                localStorage.setItem('email', res.Email);
                                res.events.forEach(function(item){
                                    dao.InsertOffline('events',item,function(){});
                                })
                                dao.InsertOffline('user', {Email:user, Password:password}, function () {});
                                window.location.hash = 'myEvents';

                            } else {
                                functionH.alert("loginFormConnexion", res.err);
                            }
                        });
                } else {
                    dao.createOffline(function () {
                        dao.QueryOffline('user', {Email:user, Password:password}, function (res) {
                            if (res.length != 0) {
                                //todo make offline id session
                                sessionStorage.setItem('id', 'idOffline');
                                window.location.hash = 'myEvents';

                            } else {
                                functionH.alert("loginFormConnexion", res.err);
                            }
                        })
                    });
                }
            });
        },
        unlogue:function () {
            functionH.isConnected(function (online) {
                if (online) {
                    dao.QueryOnline('UserDisconect', {id:window.localStorage.id},
                        function (res) {
                            window.localStorage.removeItem('id');
                            if(window.location.hash == ''){
                                window.location.hash = 'searchEvent';
                            }else{
                                window.location.hash = '';
                            }


                        });
                } else {
                    dao.QueryOffline('user', {Email:user, Password:password}, function (res) {
                        localStorage.removeItem('id');
                        if(window.location.hash == ''){
                            window.location.hash = 'searchEvent';
                        }else{
                            window.location.hash = '';
                        }
                    });
                }
            });

        }

    }
    return app;

});