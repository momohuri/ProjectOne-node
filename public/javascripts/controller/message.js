define([
    "../model/message"
], function (message) {
    var app = {
        init:function () {
            var model = message.init('message');

            $('#message').live('submit',function(event){
                event.preventDefault();
                message.send(model);
            });

        }
    }
    return app;

});