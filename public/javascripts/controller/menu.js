define([
    '../model/user'
], function (user) {

    var app = {
        logged:function () {
            $('#disconnectButtonMenu').on('click',function(event){
                user.unlogue();
            });
        },
        nonlogged:function(){
            $('#loginFormConnexion').on('submit',function(event){
                event.preventDefault();
                user.login($('#logEmail').val(),$('#logPassword').val());
            });
        }
    }
    return app;

});