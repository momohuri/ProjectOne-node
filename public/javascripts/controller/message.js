define([
    "../model/message"
], function (message) {
    var app = {
        init:function () {
            $('#message').live('submit',function(event){
                event.preventDefault();
                message.send($('#text').val());
            });
        }
    }
    return app;

});