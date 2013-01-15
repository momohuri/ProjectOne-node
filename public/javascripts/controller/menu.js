define([
    '../model/user'
], function (user) {

    var app = {
        logged:function () {
            $('#disconnect').on('click',function(event){
                user.unlogue();
            });
        },
        nonlogged:function(){
            $('#login').on('submit',function(event){
                event.preventDefault();
                user.login($('#logEmail').val(),$('#logPassword').val());
            });
        }
    }
    return app;

});