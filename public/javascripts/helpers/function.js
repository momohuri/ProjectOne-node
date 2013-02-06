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
            $('#'+idForm).append('<div style="margin-top:10px;" class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>' + err + '</div>');
        },

        //remove null from json
        remove_empty: function ( target ) {
            Object.keys( target ).map( function ( key ) {
                if ( target[ key ] instanceof Object ) {
                    if ( ! Object.keys( target[ key ] ).length ) {
                        delete target[ key ];
                    }
                    else {
                        remove_empty( target[ key ] );
                    }
                }
                else if ( target[ key ] === null ) {
                    delete target[ key ];
                }
            } );
            return target;
        }


    }
    return app;

});