if (typeof define !== 'function') {
    var define = (require('amdefine'))(module);
}

//class name : guest controller
(function (define) {
    define([
        "../model/user"
    ], function (user) {
        var Controller = {
            isConnected:function(req,res){
              res.send({work:true});
            },
            index:function (req, res) {
                res.render('index');
            },
            subscribe:function(req,res){
                var User = user.build(req.body);
                var err = User.validate();
                if(err){
                     res.send({err:err});
                }else{
                    User.hashthispassword();
                    User.save();
                    //todo sen GUID
                    res.send({work:true});
                }
            },
            connect:function(req,res){
                if(req.body.password!= '' && req.body.user!=''){

                    user.find({
                        where: [' Email=?', req.body.user]
                    }).on('success', function (row) {
                            if(row!=null){
                                if(user.verify(req.body.password,row.Password)){
                                    req.session.user=row;
                                    res.send({work:true,Email:row.Email,Password:row.Password,id:req.session.id});
                                }else{
                                    res.send({err:{err:['Email ou Mdp existe pas']}});
                                }
                            }else{
                                res.send({err:{err:['Email ou Mdp existe pas']}});
                            }
                        });
                }else{
                    res.send({err:{err:['Champs pas bien remplie']}});
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