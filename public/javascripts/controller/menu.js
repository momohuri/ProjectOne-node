define([
    '../model/user'
], function (user) {

    var app = {
        logged:function () {
            $('#disconnectButtonMenu').on('click',function(event){
                event.preventDefault();
                user.unlogue();
                return false;
            });
        },
        nonlogged:function(){
            $('#loginFormConnexion').on('submit',function(event){
                $('.container').append('coucou',$('#logEmail').val(),$('#logPassword').val());
                event.preventDefault();
                user.login($('#logEmail').val(),$('#logPassword').val());
            });
        }
    }
    return app;

});