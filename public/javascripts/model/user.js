define([
    '../helpers/dao'
], function (dao) {

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
                    console.log(res)
                });

        },
        login:function(user,password){
            var online =true;
            if(online){
                dao.QueryOnline('UserConnect', {user:user,password:password},
                    function (res) {
                        if(res.work){
                            sessionStorage.setItem('id',res.id);
                            dao.createOffline(function(){
                                dao.InsertOffline('user',{Email:user,Password:password},function(){
                                    console.log('log and clear')
                                });
                            });

                        }else{
                            //todo echo error
                            console.log(res.error);
                        }
                 });
            }else{
                dao.createOffline(function(){
                    dao.QueryOffline('user',{Email:user,Password:password},function(res){
                        if(res.length!=0){
                            //todo make offline id session
                            sessionStorage.setItem('id','idOffline');
                        }else{
                            console.log('bad password');
                        }
                    })
                });

            }

        }

    }
    return app;

});