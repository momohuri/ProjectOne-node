define([
], function () {

    var app = {
        saveOnline:function (url,data,next) {
            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                success: function(data) {
                    next(data);
                }

            });
        }
    }
    return app;

});