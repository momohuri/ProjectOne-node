define([
    '../helpers/dao',
    "../helpers/function",
    "../helpers/googlemaps",
    "../extern/bootstrap-list"


], function (dao, functionH, gmaps) {

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
                if (event.item.lat != undefined) {
                    gmaps.centerOnPlace(event.item.lat, event.item.lng);
                }
            }

            function createDataProvider(events) {
                var result = [];
                events.forEach(function (item) {
                    result.push(item)
                });

                return result;
            }

            function empty() {
                var result = [];
                var item = {};
                item.Name = 'Pas de resultats';
                result.push(item);
                return result;
            }

            function listItemLabelFunction(item) {
                var descrition = item.Name + " " + item.Description;
                return descrition;
            }

            if (events.length > 0) {
                $('#myList').list('setDataProvider', createDataProvider(events));
                $('#myList').list('setLabelFunction', listItemLabelFunction);

            } else {
                $('#myList').list('setDataProvider', empty())
            }


            $('#myList').on('change', listChangeHandler)
        }
    }
    return app;

});