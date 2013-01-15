define([
    '../model/user'
], function (Muser) {

    var app = {
        init:function () {
            var model = Muser.init('inscription');
            $('#inscription').on('submit', function (event) {
                event.preventDefault();
                Muser.create(model);
            });
        }
    }
    return app;

});