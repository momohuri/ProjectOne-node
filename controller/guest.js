if (typeof define !== 'function') {
    var define = (require('amdefine'))(module);
}

//class name : guest controller
(function (define) {
    define([
        "../model/user"
    ], function (user) {
        var Controller = {

            index:function (req, res) {
                res.render('index');
            },
            subscribe:function(req,res){
                var User = user.build(req.body);

                var err = User.validate();
                if(err){
                    res.send(err);
                }else{
                    res.send('bien inscrit');
                }

            }

        }

        return Controller;
    });

})(typeof define != "undefined" ? define : function () {
    var result = arguments[arguments.length - 1]();
    if ("undefined" != typeof(result)) {
        module.exports = result;
    }
});