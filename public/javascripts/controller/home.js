define([
    "../model/event",
    "extern/date",
    "extern/daterangepicker.jQuery",
    "extern/bootstrap.min",
    "extern/jquery.ui.touch-punch.min"
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
            $("#filter").slideUp();
            var model = Mevent.init('myModal');
            datepicker();
            require(["helpers/googlemaps"], function (maps) {

                $('#inputPlace').on('changeAddress',function(event,address){
                    $('#inputPlace').val(address);
                    $('#searchEvent').submit();
                }).on('blur',function(){
                    $('#searchEvent').submit();
                });

                $("#v-slider").slider({
                    orientation: "horizontal",
                    range: "min",
                    min: 1,
                    max: 100,
                    value: 30,
                    slide: function (event, ui) {
                        $("#amount").html(ui.value);
                    }
                });
                $("#amount").html($("#v-slider").slider("value"));

                $("#buttonSlide").on('click',function(){
                    $("#filter").slideToggle(500);
                    if($("#buttonSlide i").hasClass("icon-chevron-left")){
                        $("#buttonSlide i").removeClass("icon-chevron-left").addClass("icon-chevron-down");
                    }else{
                        $("#buttonSlide i").removeClass("icon-chevron-down").addClass("icon-chevron-left");
                    }
            });


                maps.init(function (geolocalisation) {
                    if (geolocalisation) {
                        var dateStart = $.datepicker.formatDate('yy-mm-dd', new Date($('#startDate').val().toString().split(' ')[0]));
                        var dateEnd= true;
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
                        var dateStart = $.datepicker.formatDate('yy-mm-dd', new Date($('#startDate').val().toString().split(' ')[0]));
                        if (typeof( $('#startDate').val().toString().split(' ')[2])!='undefined') {
                            var dateEnd = $.datepicker.formatDate('yy-mm-dd', new Date($('#startDate').val().toString().split(' ')[2]));
                        }else{
                            var dateEnd=true;
                        }

                        Mevent.getEvent(res[0].geometry.location.lat(), res[0].geometry.location.lng(), $("#v-slider").slider("value"), dateStart,dateEnd, function (events) {
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