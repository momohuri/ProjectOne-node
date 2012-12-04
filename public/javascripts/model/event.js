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
        getEvent:function (lat, lng, distance,date,dateEnd, next) {
            dao.QueryOnline('getEvent', {lat:lat, lng:lng, distance:distance,date:date,dateEnd:dateEnd},
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
                var result = [0];
                return result;
            }

            function listItemLabelFunction(item) {
                if(item!=0){
                    var date= new Date(item.date);
                    var descrition =item.Name+" le "+date.toLocaleDateString()+"<br>Categorie:"+item.Type+"  <a href='"+item.Link+"'>Plus d'info</a>";
                }else{
                    var descrition = "Il n'y a pas d'Evenement... Cree le votre"
                }

                return descrition;
            }
            if (events.length!=0) {
                $('#myList').list('setDataProvider', createDataProvider(events));
            } else {
                $('#myList').list('setDataProvider', empty())
            }
            $('#myList').list('setLabelFunction', listItemLabelFunction);


            $('#myList').on('change', listChangeHandler)
        }
    }
    return app;

});