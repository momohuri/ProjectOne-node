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
                    functionH.alert("event", res.err);
                });

        },
        getEvent:function (lat, lng,distance,next) {
            dao.QueryOnline('getEvent', {lat:lat, lng:lng,distance:distance},
                function (res) {
                    next(res);
                });
        }
    }
    return app;

});