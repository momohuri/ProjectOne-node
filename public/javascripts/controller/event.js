define([
    "../model/event",
    "../helpers/function"
], function (Mevent,functionH) {



    var app = {
        init:function () {
            functionH.dateTimePicker();
            var model = Mevent.init('event');
            model.model().clear();
            $('#event').on('submit',function(event){
                event.preventDefault();
                if(typeof(model.model().attributes.DateEnd)=='undefined'){
                    model.model().attributes.DateEnd=model.model().attributes.Date;
                }
                model.model().attributes.Date = $.datepicker.formatDate('yy-mm-dd', new Date(model.model().attributes.Date.toString().split(' ')[0])) + ' ' + model.model().attributes.Date.toString().slice(11,16);
                model.model().attributes.DateEnd = $.datepicker.formatDate('yy-mm-dd', new Date(model.model().attributes.DateEnd.toString().split(' ')[0])) + ' ' + model.model().attributes.DateEnd.toString().slice(11,16);
                Mevent.create(model);
            });
            require(["helpers/googlemaps"],function(maps){
                $('#inputPlace')
                    .on('changeLatLng',function(event,lat,lng){
                    model.model().set("lat",lat);
                    model.model().set("lng",lng);
                    }).on('changeAddress',function(event,address){
                    model.model().set("Address",address);
                });
                maps.autocomplete();
            });
        }
    }
    return app;

});

