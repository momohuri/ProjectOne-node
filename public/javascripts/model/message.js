define([
    '../helpers/dao',
    "../helpers/function"

], function (dao,functionH) {

    var message = new Backbone.Model(
        {
            title:'',
            message:'',
            sender_Id:''
        });


    var app = {
        init:function () {
        //pareil que dans user.js ?
        //entuilisant ce model la oui
        },

        send:function (message) {
            dao.QueryOnline('addMessage', message,
                function (res) {
                    functionH.alert("message",res.err);
                });

        }
    }
    return app;

});