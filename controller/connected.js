if (typeof define !== 'function') {
    var define = (require('amdefine'))(module);
}

//class name :
(function (define) {
    define([
        "../model/event",
        "../model/user"
    ], function (Mevent,Muser) {
        var Controller = {
            Disconnect:function (req, res) {
               req.session.user=null;
               res.send({work:true})
            },
            isLogged:function(req,res){
               if( req.session.user!=null){
                   res.send(true);
               }else{
                   res.send(false);
               }
            },
            addEvent:function(req,res){
                if( req.session.user!=null){
                    var Event = Mevent.build(req.body);
                    var err = Event.validate();
                    if(err){
                        res.send({err:err});
                    }else{
                        var User= Muser.build(req.session.user);
                        User.setCreator(Event).success(function(dbEntry){
                            res.send({id:dbEntry.id});
                        });
                    }
                }else{
                    res.send({err:{err:['Veuillez vous connecter!']}});
                }
            },
            getMyEvents:function(req,res){
                var User= Muser.build(req.session.user);
                User.getCreated(function(events){
                     res.send(events);
                })
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
