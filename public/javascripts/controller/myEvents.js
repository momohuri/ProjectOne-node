define([
    "model/event"
], function (Mevent) {

//    function getbinding(){
//        debugger
//        ko.bindingHandlers.dateString = {
//            update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
//                var value = valueAccessor(),
//                    allBindings = allBindingsAccessor();
//                var valueUnwrapped = ko.utils.unwrapObservable(value);
//                var pattern = allBindings.datePattern || 'MM/dd/yyyy';
//                $(element).text(valueUnwrapped.toString(pattern));
//
//            }
//        }
//    }

    var app = {
        init:function(){
                var model = Mevent.init('myModal');
//            getbinding();
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
        },
        initOff:function(){
            var model = Mevent.init('myModal');
            Mevent.getMyEventsOffline(function(events){
                    if (typeof(events) != 'undefined') {
                        Mevent.createList(events);
                    }
                }
            );
        }
    }
    return app;

});

