if (typeof define !== 'function') {
    var define = (require('amdefine'))(module);
}

//class name : comment Model
(function (define) {
    define([
        "sequelize"
    ], function (Sequelize) {

        if (!global.sequelize) {
            var sequelize = global.sequelize = new Sequelize("projectone", "root", "root");
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