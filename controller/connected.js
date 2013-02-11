if (typeof define !== 'function') {
    var define = (require('amdefine'))(module);
}

//class name :
(function (define) {
    define([
        "../model/event",
        "../model/user",
        "../model/comment",
        "nodemailer"
    ], function (Mevent,Muser,Mcomment,nodemailer) {
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
                    delete req.body.HasCreator;
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
                var eventId = parseInt(req.body.id,10);
                Mevent.find(eventId).success(function (Event) {
                   Muser.find(req.session.user.id).success(function(userToAdd) {
                        Event.addMember(userToAdd).success(function() {
                            res.send({succ:{succ:["Vous avez rejoins l'évènement!"]}});
                        }).error(function(error) {
                           console.log("error 1 "+error);
                           res.send({err:"error 1"});
                        })
                    }).error(function(error) {
                           console.log("error 2 "+error);
                           res.send({err:"error 2"});
                       });
                }).error(function(error) {
                        console.log("error 3 "+error);
                        res.send({err:"error 3"});
                    });
            },
            getMembersByEvent:function(req,res){
                var eventId = parseInt(req.body.id,10);
                    Mevent.find(eventId).success(function (Event) {
                        Event.getMembers().success(function(Members){
                            var listMembers=[];
                            Members.forEach(function(item){
                                listMembers.push({
                                    Name:item.Name,
                                    Surname:item.Surname,
                                    Email:item.Email
                                })
                            });
                            res.send(listMembers);
                        });
                    });
            },
            getCreatorByEvent:function(req,res){
                    var eventId = parseInt(req.body.id,10);
                    Mevent.find(eventId).success(function (Event) {
                      Muser.find(Event.Creator_id).success(function (creator) {
                          if(creator){
                            var userCreator = {
                                Name : creator.Name,
                                Surname:creator.Surname,
                                Email:creator.Email
                            }
                            res.send(userCreator);
                          }else{
                              res.send({err:"Pas de créateur car c'est un evenement professionel"});
                          }
                        });

                    });
                },
            getMyEvents:function(req,res){
                var User= Muser.build(req.session.user);
                User.getEvents().success(function(associatedEvents) {
                    var events=[];
                    associatedEvents.forEach(function(item){
                        var dateFinish = new Date(item.dateEnd);
                        var dateNow = new Date();
                        if(dateFinish > dateNow){
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
                        }
                    })
                    User.getCreated(function(eventCreated){
                        eventCreated.forEach(function(item){
                        item.Date = new Date(item.Date);
                        item.DateEnd = new Date(item.DateEnd);
                        events.push(item);
                        });
                        res.send(events);
                    })
                })

            },
            addComment:function(req,res){
                var eventId = parseInt(req.body.idEvent,10);

                if( req.session.user!=null){

                    var Comment = Mcomment.build(req.body.comment);
                    var err = Comment.validate();
                    if(err){
                        res.send({err:err});
                    }else{
                        var User= Muser.build(req.session.user);
                        User.addComment(Comment).success(function(){
                            Mevent.find(eventId).success(function(eventToComment){
                                eventToComment.addComment(Comment).success(function(){
                                    res.send({work:true});
                                });
                            });
                        }).error(function(error) {
                                console.log("error 1 "+error);
                                res.send({err:"error 1"});
                            })
                    }
                }else{
                    res.send({err:{err:['Veuillez vous connecter!']}});
                }
            },
            shareEventByMail:function(req,res){
                var smtpTransport = nodemailer.createTransport("SMTP",{
                    service: "Gmail",
                    auth: {
                        user: "invite.dailyevents@gmail.com",
                        pass: "dailyevents"
                    }
                });


                // setup e-mail data with unicode symbols
                var mailOptions = {
                    from: "daily-event <contact@daily-event.com>", // sender address
                    to: req.body.email, // list of receivers
                    subject: "Vous venez de recevoir une invitation ✔", // Subject line
                    text: "Bonjour, " +
                        req.body.name+" vous invite a le rejoindre sur http://daily-event.rs.af.cm/"+req.body.eventLink  // plaintext body
                }

                // send mail with defined transport object
                smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                        console.log(error);
                    }else{
                        console.log("Message sent: " + response.message);
                    }

                    smtpTransport.close();
                });
                res.send({succ:{succ:"L'invitation est envoye"}});
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
