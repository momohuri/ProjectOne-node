define([
    './dao'
], function (dao) {
    var app = {
        isConnected:function () {
            $.ajax({
                type:'POST',
                url:'isConnected',
                success:function () {
                    console.log('coucou');
                },
                error:function () {
                    console.log('coucou2');
                }
            });
        }
    }
    return app;

});