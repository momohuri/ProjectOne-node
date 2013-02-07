if (typeof define !== 'function') {
    var define = (require('amdefine'))(module);
}

//class name : USER Model
(function (define) {
    define([
        "sequelize"
    ], function (Sequelize) {

            var sequelize = global.sequelize;



        var event = sequelize.define('Event', {
            Name:{ type:Sequelize.STRING},
            Address:{ type:Sequelize.STRING},
            Description:{ type:Sequelize.STRING},
            lat:{type:Sequelize.STRING},
            lng:{type:Sequelize.STRING},
            Date:{type:Sequelize.DATE},
            Img:{type:Sequelize.STRING},
            Link:{type:Sequelize.STRING},
            Type:{type:Sequelize.STRING},
            DateEnd:{type:Sequelize.DATE}
        },{
            instanceMethods:{
                },
            classMethods:{
            }
        });

        return event;
    });

})(typeof define != "undefined" ? define : function () {
    var result = arguments[arguments.length - 1]();
    if ("undefined" != typeof(result)) {
        module.exports = result;
    }
});