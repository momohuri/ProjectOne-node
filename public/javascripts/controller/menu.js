define([
    '../model/user'
], function (user) {

    var app = {
        logged:function () {
            $('#login').live('submit',function(event){
                event.preventDefault();
                user.login($('#logEmail').val(),$('#logPassword').val());
            });
        },
        nonlogged:function(){

        }
    }
    return app;

});