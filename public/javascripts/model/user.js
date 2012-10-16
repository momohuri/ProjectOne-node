define([
    '../helpers/dao'
], function (dao) {

    var user = new Backbone.Model(
        {
            surname:'',
            name:'',
            pseudo:'',
            email:'',
            password:''
        });


    var app = {
        init:function (form) {
            var view_model = kb.viewModel(user);
            ko.applyBindings(view_model, $('#' + form)[0]);
            return view_model;
        },
        create:function (model) {
            //TODO envoyer ca en ajax
            dao.saveOnline('addUser', model.model().attributes,
                function (res) {
                    console.log(res)
            });
        }

    }
    return app;

});