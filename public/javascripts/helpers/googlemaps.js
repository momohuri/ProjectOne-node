define([
    "async!http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false",
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
                        $('#inputPlace').trigger('changeAddress',[results[0].formatted_address]);
                    }
                }

            )
            ;
        }


        var app = {
            init:function (next) {

                markersArray = [];
                //tableau qui contiendrat tout nos markers

                var centerpos = new google.maps.LatLng(50.6423071, 3.0532962);
                var optionsGmaps = {
                    center:centerpos,
                    mapTypeControlOptions:{
                        style:google.maps.MapTypeControlStyle.DROPDOWN_MENU
                    },
                    streetViewControl:false,
                    scaleControl:false,
                    mapTypeId:google.maps.MapTypeId.ROADMAP,
                    mapTypeControl:true,
                    zoom:12
                };


                // Initialisation de la carte avec les options
                map = new google.maps.Map(document.getElementById("map"), optionsGmaps);

                var geolocalisation = false;

                if (navigator.geolocation) {
                    // Fonction de callback en cas de succès
                    function affichePosition(position, next) {
                        codeLatLng(position.coords.latitude, position.coords.longitude);
                        // On instancie un nouvel objet LatLng pour Google Maps
                        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        var lattitude = position.coords.latitude;
                        var longitude = position.coords.longitude;
                        $('#inputPlace').trigger('changeLatLng',[lattitude,longitude]);
                        map.panTo(latlng);
                    } // Fonction de callback en cas de succès


                    navigator.geolocation.getCurrentPosition(affichePosition, erreurPosition);

                    //navigator.geolocation.getCurrentPosition(next, erreurPosition);

                } else {
                    console.log("Ce navigateur ne supporte pas la géolocalisation");
                }

            },
            searchLocations:function (next) {
                var address = document.getElementById("inputPlace").value;
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({address:address}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        lat = results[0].geometry.location.lat();
                        lng = results[0].geometry.location.lng();
                        app.centerOnPlace(lat, lng);
                    } else {
                        alert(address + ' not found');
                    }
                    next(results)
                });
            },
            autocomplete:function () {
                   var options = {
                   };
                   var input = document.getElementById('inputPlace');
                   var autocomplete = new google.maps.places.Autocomplete(input, options);

                     google.maps.event.addListener(autocomplete, 'place_changed', function() {
                        var place = autocomplete.getPlace();
                        var lattitude = place.geometry.location.lat();
                        var longitude = place.geometry.location.lng();


                        $('#inputPlace').trigger('changeLatLng',[lattitude,longitude]);

                    });
            },
            addMarker:function (lat, lng, item, number) {
                //  var map= document.getElementById('map');
                var myLatlng = new google.maps.LatLng(lat, lng);
                var marker = new google.maps.Marker({
                    map:map,
                    position:myLatlng,
                    title:item['Name'],
                    html:number
                });

                markersArray.push(marker);

                google.maps.event.addListener(marker, 'click', function () {
                    $('#myList').list('setSelectedIndex', this.html)
                    .list.showModal( $('#myList').data().list.dataProvider[this.html]);


                });

            },
            clearMarker:function () {
                for (var i = 0; i < markersArray.length; i++) {
                    markersArray[i].setMap(null);
                }
            },
            centerOnPlace:function (lat, lng) {
                var latlng = new google.maps.LatLng(lat, lng);
                map.panTo(latlng);
            }
        }
        return app;

    }
)
;