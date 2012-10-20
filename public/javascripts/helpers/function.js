define([

], function () {
    var app = {
        isConnected:function (next) {
            $.ajax({
                type:'POST',
                url:'isConnected',
                success:function () {
                    next(true);
                },
                error:function () {
                    next(false);
                }
            });
        },


        alert:function (idForm,error){
            var err='';
            for(item in error){
                for(var i=0; i<error[item].length;i++){
                    err+=error[item][i]+'<br/>';
                }
            };

            $('.alert').remove();
            $('#'+idForm).after('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>' + err + '</div>');
        }
    }
    return app;

});