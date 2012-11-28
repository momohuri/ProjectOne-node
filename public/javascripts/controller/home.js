define([
    "../model/event",
    "extern/bootstrap-datepicker",
    "extern/bootstrap.min"
], function (Mevent) {

    function datepicker() {
        $('#startDate').datepicker();
        var today = new Date();
        var t = today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear().toString().substr(2, 4);
        $('#startDate').val(t);
    }

    var app = {
        init:function () {
            datepicker();
            require(["helpers/googlemaps"], function (maps) {
                maps.init(function (geolocalisation) {
                    if (geolocalisation) {
                        var date= '20'+$('#startDate').val().substr(6,8)+'-'+$('#startDate').val().substr(3,2)+'-'+$('#startDate').val().substr(0,2);
                        Mevent.getEvent(geolocalisation.coords.latitude, geolocalisation.coords.longitude, 30,date, function (events) {
                                if (typeof(events) != 'undefined') {
                                    Mevent.createList(events);
                                    maps.clearMarker();
                                    var i = 0;
                                    events.forEach(function (item) {
                                        maps.addMarker(item.lat, item.lng, item, i);
                                        i++;
                                    })
                                }
                            }
                        )
                        ;

                    }
                });

                maps.autocomplete();
                $('#searchEvent').live('submit', function (event) {
                    event.preventDefault();
                    maps.searchLocations(function (res) {
                        //todo le 30 correspond a la distance, faut le rendre dynamique
                        var date= '20'+$('#startDate').val().substr(6,8)+'-'+$('#startDate').val().substr(3,2)+'-'+$('#startDate').val().substr(0,2);
                        Mevent.getEvent(res[0].geometry.location.lat(), res[0].geometry.location.lng(), 30, date,function (events) {
                            if (typeof(events) != 'undefined') {
                                Mevent.createList(events);
                                maps.clearMarker();
                                var i = 0;
                                events.forEach(function (item) {
                                    maps.addMarker(item.lat, item.lng, item, i)
                                    i++;
                                })
                            }
                        });
                    });

                });
            });

        }
    }
    return app;
});