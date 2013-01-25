define([
    "model/event"
], function (Mevent) {


    var app = {
        init:function(){
            Mevent.getMyEventsOnline(function(res){

            })
        }
    }
    return app;

});

