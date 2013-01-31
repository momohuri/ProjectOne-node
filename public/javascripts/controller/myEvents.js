define([
    "model/event"
], function (Mevent) {


    var app = {
        init:function(){


                var model = Mevent.init('myModal');
                debugger
                require(["helpers/googlemaps"], function (maps) {
                    maps.init(function (geolocalisation) {
                            Mevent.getMyEventsOnline(function(events){
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
                            );

                });
            })
        }
    }
    return app;

});
