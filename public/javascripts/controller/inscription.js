define([
    '../model/user'
], function (Muser) {

    var app = {
        init:function () {
            var model = Muser.init('inscription');
            $('#inscription').live('submit', function (event) {
                event.preventDefault();
                Muser.create(model);
            });
        }
    }
    return app;

});