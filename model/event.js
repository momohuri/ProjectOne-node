if (typeof define !== 'function') {
    var define = (require('amdefine'))(module);
}

//class name : USER Model
(function (define) {
    define([
        "sequelize"
    ], function (Sequelize) {

        if (!global.sequelize) {
            var sequelize = global.sequelize = new Sequelize("projectone", "root");
        } else {
            var sequelize = global.sequelize;
        }


        var event = sequelize.define('Event', {
            Name:{ type:Sequelize.STRING},
            Address:{ type:Sequelize.STRING},
            lat:{type:Sequelize.STRING},
            lng:{type:Sequelize.STRING},
            date:{type:Sequelize.DATE},
            Img:{type:Sequelize.STRING}
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