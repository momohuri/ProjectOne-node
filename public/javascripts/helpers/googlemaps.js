define([
    "async!http://maps.google.com/maps/api/js?sensor=false",
    "extern/jquery-ui"
], function (gmaps) {

        // Fonction de callback en cas d’erreur
        function erreurPosition(error) {
            var info = "Erreur lors de la géolocalisation : ";
            switch (error.code) {
                case error.TIMEOUT:
                    info += "Timeout !";
                    break;
                case error.PERMISSION_DENIED:
                    info += "Vous n’avez pas donné la permission";
                    break;
                case error.POSITION_UNAVAILABLE:
                    info += "La position n’a pu être déterminée";
                    break;
                case error.UNKNOWN_ERROR:
                    info += "Erreur inconnue";
                    break;
            }
        }

        function codeLatLng(lat, lng) {
            geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(lat, lng);
            geocoder.geocode({'latLng':latlng}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        $('#inputPlace').val(results[0].formatted_address);
                    }
                }

            )
            ;
        }

        function centerOnCity(center) {
            var latlng = new google.maps.LatLng(center.lat(), center.lng());
            //map = new google.maps.Map(document.getElementById("map"));
            map.panTo(latlng);
        }

        var app = {
            init:function () {

                markersArray = [];
                //tableau qui contienrat tout nos markers

                var centerpos = new google.maps.LatLng(48.579400, 7.7519);
                var optionsGmaps = {
                    center:centerpos,
                    mapTypeControlOptions:{
                        style:google.maps.MapTypeControlStyle.DROPDOWN_MENU
                    },
                    streetViewControl:false,
                    scaleControl:false,
                    mapTypeId:google.maps.MapTypeId.ROADMAP,
                    mapTypeControl:true,
                    zoom:15
                };


                // Initialisation de la carte avec les options
                map = new google.maps.Map(document.getElementById("map"), optionsGmaps);

                var geolocalisation = false;

                if (navigator.geolocation) {

                    // Fonction de callback en cas de succès
                    function affichePosition(position) {
                        codeLatLng(position.coords.latitude, position.coords.longitude);
                        // On instancie un nouvel objet LatLng pour Google Maps
                        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        map.panTo(latlng);
                        geolocalisation= true;
                    }

                    navigator.geolocation.getCurrentPosition(affichePosition, erreurPosition);

                } else {
                    console.log("Ce navigateur ne supporte pas la géolocalisation");
                }
               // next(geolocalisation)
            },
            searchLocations:function (next) {
                var address = document.getElementById("inputPlace").value;
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({address:address}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        centerOnCity(results[0].geometry.location);
                    } else {
                        alert(address + ' not found');
                    }
                    next(results)
                });
            },
            autocomplete:function () {
                $("#inputPlace").autocomplete({
                    source:function (request, response) {
                        $.ajax({
                            url:"http://ws.geonames.org/searchJSON",
                            dataType:"jsonp",
                            data:{
                                featureClass:"P",
                                country:"FR",
                                style:"full",
                                maxRows:12,
                                name_startsWith:request.term
                            },
                            success:function (data) {
                                response($.map(data.geonames, function (item) {
                                    return {
                                        label:item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName,
                                        value:item.name
                                    }
                                }));
                            }
                        });
                    },
                    minLength:2,
                    select:function (event, ui) {
                        this.value = ui.item.label;
                    },
                    open:function () {
                        $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                    },
                    close:function () {
                        $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                    }
                });
            },
            addMarker:function (lat, lng, title, description) {
                //  var map= document.getElementById('map');
                var myLatlng = new google.maps.LatLng(lat, lng);
                var marker = new google.maps.Marker({
                    map:map,
                    position:myLatlng,
                    title:title,
                    html:description
                });

                markersArray.push(marker);
                infowindow = new google.maps.InfoWindow({
                    content:"holding...",
                    maxWidth:275
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.setContent(this.html);
                    infowindow.open(map, this);
                });

            },
            clearMarker:function () {
                for (var i = 0; i < markersArray.length; i++) {
                    markersArray[i].setMap(null);
                }
            }
        }
        return app;

    }
)
;