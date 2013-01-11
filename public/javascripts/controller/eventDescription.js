define([
    "../model/event"
], function (Mevent) {

    var app = {

        init:function (id) {
            var model = Mevent.init('eventDescription');
            Mevent.getEventById(id,function(event){
                console.log(event);
                debugger
            });

        }
    }
    return app;
});