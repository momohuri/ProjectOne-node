define([
    '../model/user'
], function (Muser) {

    var app = {
        init:function () {
            var model = Muser.init('inscription');
            $('#inscription').live('submit', function (event) {
                Muser.create(model);
                event.preventDefault();
            });
        }
    }
    return app;

});