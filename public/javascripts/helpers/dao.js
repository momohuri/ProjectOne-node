define([
    '../extern/localstoragedb.min'
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
            var result = document.db.query(table, function(row) {
                var exist=true;
                for(var item in where ){
                    if(row[item] !=where[item]){
                        exist=false;
                    }
                }
                    return exist;
            });
            next(result);
        },
        InsertOffline:function(table,value,next){
            document.db.insert(table, value);
            document.db.commit();
            next();
        },
        createOffline:function(next){
            document.db = new localStorageDB("dailyEvent");

            if(  document.db.isNew() ) {
                //ici la liste de nos table
                document.db.createTable("user", ["Email", "Password"]);
                document.db.commit();
            }
            next();
        }


    }
    return app;

});