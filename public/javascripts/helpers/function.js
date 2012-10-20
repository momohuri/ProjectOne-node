define([

], function () {
    var app = {
        isConnected:function () {
            dao.QueryOnline("isConnected",{},function(res){
                if(res.work){
                    console.log('connecter')
                }else{
                    console.log('pas connecter')
                }

            })
        }
    }
    return app;

});