define([
], function () {

    var app = {
        QueryOnline:function (url,data,next) {
            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                success: function(data) {
                    next(data);
                }

            });
        },
        QueryOffline:function(table,where,next){


        }
    }
    return app;

});