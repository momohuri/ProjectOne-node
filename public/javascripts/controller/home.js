define([
    "../model/user",
    "extern/bootstrap-datepicker",
    "extern/bootstrap.min"
], function (user) {

    function datepicker() {
        $('#start').datepicker();
        var today = new Date();
        var t = today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear().toString().substr(2,4);
        $('#start').val(t);
    }

    var app = {
        init:function () {
            datepicker();
            var model = user.init('inscription');

            $('#inscription').live('submit', function (event) {
                user.create(model);
                event.preventDefault();
            });
            require(["helpers/googlemaps"], function (maps) {
                maps.init();
                maps.autocomplete();
                $('#searchEvent').live('submit', function (event) {
                    event.preventDefault();
                    maps.searchLocations()
                });


            });

        }
    }
    return app;
});