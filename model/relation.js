if (typeof define !== 'function') {
    var define = (require('amdefine'))(module);
}


(function (define) {
    define([
        "./user",
        "./event",
        "./message"
    ], function (user,event,message) {
        var relation = {
            create:function () {
                user.hasMany(message);
                // user.hasMany(message, { as :"Receiver_ID" });
                //TODO don t work for the moment lets see after
                user.hasMany(event,{as : "Events"});
                event.hasMany(user,{as:"Members"});
                user.hasOne(event,{as:"Creator", foreignKey: 'Creator_id'});

                message.sync();
                user.sync();
                event.sync();

            }
        }

        return relation;
    });

})(typeof define != "undefined" ? define : function () {
    var result = arguments[arguments.length - 1]();
    if ("undefined" != typeof(result)) {
        module.exports = result;
    }
});