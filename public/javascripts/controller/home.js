define([
    "../model/event",
    "extern/bootstrap-datepicker",
    "extern/bootstrap.min"
], function (Mevent) {

    function datepicker() {
        $('#start').datepicker();
        var today = new Date();
        var t = today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear().toString().substr(2, 4);
        $('#start').val(t);
    }

    var app = {
        init:function () {
            datepicker();
            require(["helpers/googlemaps"], function (maps) {
                maps.init(function(geolocalisation){
                    if(geolocalisation){
                        Mevent.getEvent(geolocalisation.coords.latitude, geolocalisation.coords.longitude,30,function(events){
                            maps.clearMarker();
                            events.forEach(function(item){
                                maps.addMarker(item.lat,item.lng,item.Name,item.Description);
                                Mevent.addToList(item);
                            })
                        });
                    }
                });

                maps.autocomplete();
                $('#searchEvent').live('submit', function (event) {
                    event.preventDefault();
                    maps.searchLocations(function (res) {
                        //todo le 30 correspond a la distance, faut le rendre dynamique
                        Mevent.getEvent(res[0].geometry.location.lat(), res[0].geometry.location.lng(),30,function(events){
                            maps.clearMarker();
                            events.forEach(function(item){
                                maps.addMarker(item.lat,item.lng,item.Name,item.Description)
                            })
                        });
                    });

                });
            });

        }
    }
    return app;
});