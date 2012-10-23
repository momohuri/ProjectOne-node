define([
    '../helpers/dao',
    "../helpers/function"

], function (dao,functionH) {

    var message = new Backbone.Model(
        {
            title:'',
            message:'',
            sender_Id:''
        });


    var app = {
        init:function () {
            var view_model = kb.viewModel(message);
            ko.applyBindings(view_model, $('#' + form)[0]);
            return view_model;
        },

        send:function (message) {
            dao.QueryOnline('addMessage', message,
                function (res) {
                    functionH.alert("message",res.err);
                });

        }
    }
    return app;

});