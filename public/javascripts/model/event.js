define([
    '../helpers/dao',
    "../helpers/function",
    "../extern/bootstrap-list"

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
        getEvent:function (lat, lng, distance, next) {
            dao.QueryOnline('getEvent', {lat:lat, lng:lng, distance:distance},
                function (res) {
                    next(res);
                });
        },
        createList:function (events) {
            function listChangeHandler(event) {
                var message = "selected index: " + event.item + "\n" +

                alert(message);
            }

            function createDataProvider(events) {
                var result = [];
                events.forEach(function (item) {
                    result.push(item.Name)
                });

                return result;
            }

            function empty() {
                var result = [];
                result.push('Pas de resultats')
                return result;
            }

            if (events.length > 0) {
                $('#myList').list('setDataProvider', createDataProvider(events))
            } else {
                $('#myList').list('setDataProvider', empty())
            }

            $('#myList').on('change', listChangeHandler)
        }
    }
    return app;

});