if (typeof define !== 'function') {
    var define = (require('amdefine'))(module);
}

//class name : comment Model
(function (define) {
    define([
        "sequelize",
        "../helpers/helper"
    ], function (Sequelize,helper) {

        var sequelize= helper.connectDb();

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