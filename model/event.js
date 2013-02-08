if (typeof define !== 'function') {
    var define = (require('amdefine'))(module);
}

//class name : USER Model
(function (define) {
    define([
        "sequelize",
        "../helpers/helper"
    ], function (Sequelize,helper) {

        var sequelize= helper.connectDb();



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
                getCommentsByDate:function(next){
                    sequelize.query('SELECT *,Users.name as Creator_Name FROM projectone.Comments join Users on Comments.UserId= Users.id join Events on Comments.EventId= Events.id where EventId='+this.id+" ORDER BY Comments.createdAt DESC;", null, { raw: true }).success(function(data){
                        next(data);
                    }).error(function(err){
                        console.log('err',err)
                        next([]);
                    })
                }
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