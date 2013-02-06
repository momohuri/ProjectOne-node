define([
    './function',
    '../extern/localstoragedb.min'

], function (functionH) {

    var app = {
        QueryOnline:function (url, data, next) {
            $.ajax({
                type:'POST',
                url:url,
                data:data,
                success:function (data) {
                    next(data);
                }

            });
        },
        QueryOffline:function (table, where, next) {
            var result = document.db.query(table, function (row) {
                var exist = true;
                for (var item in where) {
                    if (row[item] != where[item]) {
                        exist = false;
                    }
                }
                return exist;
            });
            next(result);
        },
        InsertOffline:function (table, value, next) {
            debugger
            value = functionH.remove_empty(value);
            var exist = document.db.query(table,value);
            if(exist==0){
                document.db.insert(table, value);
                document.db.commit();
            }
            next();
        },
        createOffline:function (next) {
            document.db = new localStorageDB("dailyEvent");
            if (document.db.isNew()) {
                //ici la liste de nos table
                document.db.createTable("user", ["Email", "Password"]);
                document.db.createTable("events",["Name","Address","Description","lat","lng","Date","Img","Link","Type","DateEnd"]);
                document.db.commit();
            }
            next();
        }


    }
    return app;

});