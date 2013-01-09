if (typeof define !== 'function') {
    var define = (require('amdefine'))(module);
}

//class name :
(function (define) {
    define([
        "sequelize",
        "./user"
    ], function (Sequelize,user) {
        if(!global.sequelize){
            var sequelize= global.sequelize = new Sequelize("projectone", "root", "root");
        }else{
            var sequelize= global.sequelize;
        }
          var message= sequelize.define('Message', {
            title: Sequelize.STRING ,
            message:Sequelize.TEXT,
            sender_Id:Sequelize.INTEGER
        });


        return message;


    });

})(typeof define != "undefined" ? define : function () {
    var result = arguments[arguments.length - 1]();
    if ("undefined" != typeof(result)) {
        module.exports = result;
    }
});