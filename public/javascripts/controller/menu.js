define([
    '../model/user'
], function (user) {

    var app = {
        logged:function () {
            $('#disconnect').live('click',function(event){
                user.unlogue();
            });
        },
        nonlogged:function(){
            $('#login').live('submit',function(event){
                event.preventDefault();
                user.login($('#logEmail').val(),$('#logPassword').val());
            });
        }
    }
    return app;

});