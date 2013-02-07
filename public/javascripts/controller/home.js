define([
    "../model/event",
    "extern/date",
    "extern/daterangepicker.jQuery",
    "extern/bootstrap.min"
], function (Mevent) {

    function datepicker() {
        var date = new Date;
        $('#startDate').val(date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear())
            .daterangepicker({
            presetRanges:[
                {text:'Aujourd\'hui', dateStart:'Today', dateEnd:'Today' },
                {text:'Cette semaine', dateStart:'Today', dateEnd:'next week' },
                {text:'La fin des temps', dateStart:'Today', dateEnd:'next year' }
            ]
        });
    }

    var app = {
        init:function () {

            var model = Mevent.init('myModal');
            datepicker();
            require(["helpers/googlemaps"], function (maps) {

                $('#inputPlace').on('changeAddress',function(event,address){
                    $('#inputPlace').val(address);
                    $('#searchEvent').submit();
                }).on('blur',function(){
                    $('#searchEvent').submit();
                });


                maps.init(function (geolocalisation) {
                    if (geolocalisation) {
                        var dateStart = $.datepicker.formatDate('yy-mm-dd', new Date($('#startDate').val().toString().split(' ')[0]));
                        var dateEnd= false;
                        Mevent.getEvent(geolocalisation.coords.latitude, geolocalisation.coords.longitude, 30,dateStart,dateEnd, function (events) {
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
                $('#searchEvent').on('submit', function (event) {
                    event.preventDefault();
                    maps.searchLocations(function (res) {
                        //todo le 30 correspond a la distance, faut le rendre dynamique
                        var dateStart = $.datepicker.formatDate('yy-mm-dd', new Date($('#startDate').val().toString().split(' ')[0]));
                        if (typeof( $('#startDate').val().toString().split(' ')[2])!='undefined') {
                            var dateEnd = $.datepicker.formatDate('yy-mm-dd', new Date($('#startDate').val().toString().split(' ')[2]));
                        }else{
                            var dateEnd=dateStart;
                        }

                        Mevent.getEvent(res[0].geometry.location.lat(), res[0].geometry.location.lng(), 30, dateStart,dateEnd, function (events) {
                            if (typeof(events) != 'undefined') {
                                Mevent.createList(events);
                                maps.clearMarker();
                                var i = 0;
                                events.forEach(function (item) {
                                    maps.addMarker(item.lat, item.lng, item, i)
                                    i++;
                                });
                            }
                        });
                    });

                });
            });

        }
    }
    return app;
});