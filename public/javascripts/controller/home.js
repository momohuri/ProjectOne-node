define([
    "../model/user",
    "extern/bootstrap-datepicker",
    "extern/bootstrap.min"
], function (user) {

    function get_date(text, user) {
        var d_split = text.split('/');
        var d = new Date(0);
        return d.setFullYear(d_split[2], d_split[1], d_split[0])
    }

    function datepicker() {
        $('#start, #end').datepicker().on('changeDate', function (e) {
            if (get_date($('#start').val()) >= get_date($('#end').val())) {
                $('#alerte').show();
                $('#Search').attr('disabled', true);
            }
            else {
                $('#alerte').hide();
                $('#Search').attr('disabled', false);
            }
        });
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