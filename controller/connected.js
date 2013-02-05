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
            joinEvent:function(req,res){
                var eventId = parseInt(req.body.Id,10);
                Mevent.find(eventId).success(function (Event) {
                   Event.setMembers([req.session.user]).success(function() {
                   res.send({work:true});
                })
                });
            },
            getMyEvents:function(req,res){
                var User= Muser.build(req.session.user);
                User.getEvents().success(function(associatedEvents) {
                    var events=[];
                    associatedEvents.forEach(function(item){
                        events.push({
                            Name:item.Name,
                            Description:item.Description,
                            Date:item.Date,
                            DateEnd:item.DateEnd,
                            Address:item.Address,
                            Type:item.Type,
                            lat:item.lat,
                            lng:item.lng,
                            CreatorId:item.Creator_Id,
                            Link:item.Link
                        })
                    })
                    User.getCreated(function(eventCreated){
                        events = events.concat(eventCreated);
                        res.send(events);
                    })
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
