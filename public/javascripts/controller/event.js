define([
    "../model/event"
], function (event) {
    var app = {
        init:function () {
            var model = event.init('event');

            $('#event').live('submit',function(event){
                event.preventDefault();
                event.create(model);
            });
            require(["helpers/googlemaps"],function(maps){
                maps.init();
            });

        }
    }
    return app;

});