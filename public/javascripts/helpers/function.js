define([
    './dao'
], function (dao) {
    var app = {
        isConnected:function () {
            dao.QueryOnline("isConnected",{},function(res){
                if(res.work){
                    console.log('connecter')
                }else{
                    console.log('error')
                }

            })
        }
    }
    return app;

});