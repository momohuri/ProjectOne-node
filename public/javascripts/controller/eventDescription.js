define([
    "../model/event"
], function (Mevent) {

    var app = {

        init:function (id) {
            var model = Mevent.init('eventDescription');
            Mevent.getEventById(id,function(event){
                model.model().set(event);
            });

        }
    }
    return app;
});