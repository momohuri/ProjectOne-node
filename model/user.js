if (typeof define !== 'function') {
    var define = (require('amdefine'))(module);
}

//class name : USER Model
(function (define) {
    define([
        "sequelize",
        "./message",
        "password-hash"
    ], function (Sequelize, message, hash) {


        if (!global.sequelize) {
            var sequelize = global.sequelize = new Sequelize("projectone", "root");
        } else {
            var sequelize = global.sequelize;
        }


        var user = sequelize.define('User', {
                Name:{ type:Sequelize.STRING},
                Surname:{ type:Sequelize.STRING},
                Email:{type:Sequelize.STRING, validate:{ isEmail:{msg:"L'adresse mail n'est pas conforme"}, notNull:{msg:"L'adresse mail ne peut pas etre vide"}}},
                Password:{type:Sequelize.STRING, validate:{len:{args:6, msg:"le mot de passe doit faire au moins 6 charactere"}, notNull:{msg:"Le mot de passe ne peut pas etre vide"}}},
                Birthday:{type:Sequelize.DATE},
                Img:{type:Sequelize.STRING}
            }, { instanceMethods:{
            hashpassword:function () {
                this.Password= hash.generate(this.Password);
                }
            }
        });




        user.hasMany(message);
        // user.hasMany(message, { as :"Receiver_ID" });
        //TODO don t work for the moment lets see after

        user.sync();
        return user;
    });

})(typeof define != "undefined" ? define : function () {
    var result = arguments[arguments.length - 1]();
    if ("undefined" != typeof(result)) {
        module.exports = result;
    }
});