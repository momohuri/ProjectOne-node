define([
    './dao'
], function (dao) {
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
        }
    }
    return app;

});