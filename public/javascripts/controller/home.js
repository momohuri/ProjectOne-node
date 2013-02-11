define([
    "../model/event",
    "extern/date",
    "extern/daterangepicker.jQuery",
    "extern/bootstrap.min"
], function (Mevent) {

    function datepicker() {
        var date = new Date;
        var month= date.getMonth() + 1;
        $('#startDate').val(date.getDate() + '/' + month+ '/' + date.getFullYear())
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
                });

                $('#startDate').on('change',function(){
                    $('#searchEvent').submit();
                });
                $('#categorie').on('change',function(){
                    $('#searchEvent').submit();
                });
                $('#amount').on('change',function(){
                    $('#searchEvent').submit();
                });


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
                        var dateStart = $.datepicker.formatDate('yy-mm-dd', new Date($('#startDate').val().toString().split('/')[1]+'/'+$('#startDate').val().toString().split('/')[0]+'/'+$('#startDate').val().toString().split(' ')[0].split('/')[2]));
                        var dateEnd= true;
                        Mevent.getEvent(geolocalisation.coords.latitude, geolocalisation.coords.longitude, 30,dateStart,dateEnd,$('#categorie').val(), function (events) {
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
                        var dateStart = $.datepicker.formatDate('yy-mm-dd',  new Date($('#startDate').val().toString().split('/')[1]+'/'+$('#startDate').val().toString().split('/')[0]+'/'+$('#startDate').val().toString().split(' ')[0].split('/')[2]));
                        if (typeof( $('#startDate').val().toString().split(' ')[2])!='undefined') {
                            var dateEnd = new Date($('#startDate').val().toString().split(' ')[2].split('/')[1]+'/'+  $('#startDate').val().toString().split(' ')[2].split('/')[0]+  '/'+$('#startDate').val().toString().split(' ')[2].split('/')[2]).toString('yyyy-MM-dd');
                        }else{
                            var dateEnd=true;
                        }
                        var distance = "";
                        if($("#amount").val() != "undefined" && $("#amount").val() != ""){
                            distance = $("#amount").val();
                        }else{
                            distance = 5000;
                        }

                        Mevent.getEvent(res[0].geometry.location.lat(), res[0].geometry.location.lng(), distance, dateStart,dateEnd,$('#categorie').val(), function (events) {
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