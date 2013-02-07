if (typeof define !== 'function') {
    var define = (require('amdefine'))(module);
}

//class name : comment Model
(function (define) {
    define([
        "sequelize"
    ], function (Sequelize) {

        if (!global.sequelize) {
            if(process.env.VCAP_SERVICES){
                var env = JSON.parse(process.env.VCAP_SERVICES);
                var mysql_config = env["mysql-5.1"][0]["credentials"];
                var username = mysql_config["username"];
                var pass=mysql_config["password"];
            }else{
                var username='root';
                var pass='root';
            }
            var sequelize = global.sequelize = new Sequelize("projectone", username,pass);
        } else {
            var sequelize = global.sequelize;
        }



        var comment = sequelize.define('Comment', {
            Comment:{ type:Sequelize.STRING}

        },{
            instanceMethods:{
            },
            classMethods:{
            }
        });

        return comment;
    });

})(typeof define != "undefined" ? define : function () {
    var result = arguments[arguments.length - 1]();
    if ("undefined" != typeof(result)) {
        module.exports = result;
    }
});