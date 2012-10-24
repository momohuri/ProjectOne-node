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

        }
    }
    return app;

});