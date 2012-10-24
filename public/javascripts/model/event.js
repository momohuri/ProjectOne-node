define([
    '../helpers/dao',
    "../helpers/function"

], function (dao, functionH) {

    var event = new Backbone.Model(
        {
            toto:'',
            tata:'',
            titi:''
        });


    var app = {
        init:function (form) {
            var view_model = kb.viewModel(event);
            ko.applyBindings(view_model, $('#' + form)[0]);
            return view_model;
        },

        create:function (event) {
            dao.QueryOnline('addEvent', event.model().attributes,
                function (res) {
                    functionH.alert("event",res.err);
                });

        }
    }
    return app;

});