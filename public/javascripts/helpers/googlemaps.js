define([
    "async!http://maps.google.com/maps/api/js?v=3&sensor=false",
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
            document.map.panTo(latlng);
        }

        var app = {
            init:function () {
                var centerpos = new google.maps.LatLng(48.579400, 7.7519);

// Ansi que des options pour la carte, centrée sur latlng
                var optionsGmaps = {
                    center:centerpos,
                    mapTypeControlOptions:{
                        style:google.maps.MapTypeControlStyle.DROPDOWN_MENU
                    },
                    streetViewControl:false,
                    mapTypeId:google.maps.MapTypeId.ROADMAP,
                    zoom:15
                };

// Initialisation de la carte avec les options
                var map = new google.maps.Map(document.getElementById("map"), optionsGmaps);
                document.map = map;

                if (navigator.geolocation) {

                    // Fonction de callback en cas de succès
                    function affichePosition(position) {
                        codeLatLng(position.coords.latitude, position.coords.longitude);
                        // On instancie un nouvel objet LatLng pour Google Maps
                        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                        // Ajout d'un marqueur à la position trouvée

                        map.panTo(latlng);

                    }

                    navigator.geolocation.getCurrentPosition(affichePosition, erreurPosition);

                } else {

                    console.log("Ce navigateur ne supporte pas la géolocalisation");

                }


            },
            searchLocations:function () {
                var address = document.getElementById("inputPlace").value;
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({address:address}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        centerOnCity(results[0].geometry.location);
                    } else {
                        alert(address + ' not found');
                    }
                });
            },
            autocomplete:function(){
                $( "#inputPlace" ).autocomplete({
                    source: function( request, response ) {
                        $.ajax({
                            url: "http://ws.geonames.org/searchJSON",
                            dataType: "jsonp",
                            data: {
                                featureClass: "P",
                                country:"FR",
                                style: "full",
                                maxRows: 12,
                                name_startsWith: request.term
                            },
                            success: function( data ) {
                                response( $.map( data.geonames, function( item ) {
                                    return {
                                        label: item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName,
                                        value: item.name
                                    }
                                }));
                            }
                        });
                    },
                    minLength: 2,
                    select: function( event, ui ) {
                        this.value= ui.item.label;
                    },
                    open: function() {
                        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
                    },
                    close: function() {
                        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
                    }
                });
            }
        }
        return app;

    }
)
;