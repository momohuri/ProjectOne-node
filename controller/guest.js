if (typeof define !== 'function') {
    var define = (require('amdefine'))(module);
}

//class name : guest controller
(function (define) {
    define([
        "../model/event",
        "../model/user",
        "../model/comment"
    ], function (Mevent, Muser,Mcomment) {
        var Controller = {
            isConnected:function (req, res) {
                res.send({work:true});
            },
            index:function (req, res) {
                res.render('index');
            },
            subscribe:function (req, res) {
                delete req.body.IsLogged;
                delete req.body.IsCreator;
                delete req.body.IsMember;
                var user = Muser.build(req.body);
                Muser.find({where:[' Email=?', req.body.Email]}).on('success', function (row) {
                    if (row != null) {
                        res.send({err:{err:['Email deja utilise']}});
                    } else {
                        var err = user.validate();
                        if (err) {
                            res.send({err:err});
                        } else {
                            user.hashthispassword();
                            user.save();
                            //todo send GUID
                            res.send({work:true});
                        }
                    }
                });
            },
            connect:function (req, res) {
                if (req.body.password != '' && req.body.user != '') {
                    Muser.find({
                        where:[' Email=?', req.body.user]
                    }).on('success', function (User) {
                            if (User != null) {
                                if (Muser.verify(req.body.password, User.Password)) {
                                    req.session.user=User;
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
                                            res.send({work:true, Email:User.Email, Password:User.Password, id:req.session.id, userId:User.id,Name:User.Name,Surname:User.Surname,events:events});

                                        })
                                    }).error(function(err){
                                             console.log('err2',err);
                                             res.send(true)
                                         });

                                } else {
                                    res.send({err:{err:['Email ou Mdp existe pas']}});
                                }
                            } else {
                                res.send({err:{err:['Email ou Mdp existe pas']}});
                            }
                        });
                } else {
                    res.send({err:{err:['Champs pas bien remplie']}});
                }
            },
            getEvent:function (req, res) {
                var lng = req.body.lng;
                var lat = req.body.lat;
                var distance = req.body.distance;
                if (req.body.dateEnd == "true") {
                    req.body.dateEnd = req.body.date;
                }
                Mevent.findAll({where:[" ( 6371 * acos( cos( radians(?) ) * cos( radians( `lat` ) ) * cos( radians( `lng` ) - radians(?) ) + sin( radians(?) ) * sin( radians( `lat` ) ) ) ) < ? " +
                    "and DATE(date)BETWEEN ? AND ? and Type like ?",
                    lat, lng, lat, distance, req.body.date, req.body.dateEnd,req.body.categorie]}).success(function (Events) {
                        Events.forEach(function(item){
                            item.Date = new Date(item.Date);
                            item.DateEnd = new Date(item.DateEnd)
                        });
                        res.send(Events);
                    })

            },
            getEventById:function (req, res) {
                var id = parseInt(req.body.id,10);
                Mevent.find(id).success(function (Event) {
                    var eventDescription = {
                        id : id,
                        Name : Event.Name,
                        Description : Event.Description,
                        Address : Event.Address,
                        lat : Event.lat,
                        lng : Event.lng,
                        Date : Event.Date,
                        DateEnd : Event.DateEnd,
                        CreatorId : Event.Creator_id,
                        Type: Event.Type
                    }
                    if(Event.Link!=null){
                        eventDescription.Link=Event.Link;
                    }else{
                        eventDescription.Link='#eventDescription/'+id;
                    }
                    if(req.session.user){
                        Muser.find(req.session.user.id).success(function(userHasMember) {
                            Event.hasMembers([userHasMember]).success(function(result){
                                    if(result){
                                        eventDescription.IsMember = true;
                                        res.send(eventDescription);
                                    }else{
                                        eventDescription.IsMember = false;
                                        res.send(eventDescription);
                                    }
                                }
                            );
                        });
                    }else{
                        eventDescription.IsMember = false;
                        res.send(eventDescription);
                    }
                })

            },
            getComments:function(req,res){
                var id = parseInt(req.body.idEvent,10);
                var idUser = null;
                if(req.session.user){
                    idUser = req.session.user.id;
                }
                Mevent.find(id).success(function(result){
                    result.getCommentsByDate(function(items){
                        var comments = [];
                        items.forEach(function(item){
                            if(item.Comment != ""){
                                var commentToAdd = {
                                    commentId:item.CommentId,
                                    Comment:item.Comment,
                                    IsCommentCreator: false,
                                    creatorName:item.Surname+" "+item.Creator_Name,
                                    commentDate:"à "+new Date(item.createdAt).toLocaleTimeString()+" le "+new Date(item.createdAt).toDateString()
                                }
                                if( idUser == item.UserId){
                                    commentToAdd.IsCommentCreator = true;
                                }
                                comments.push(commentToAdd);
                            }
                        })
                        res.send(comments);
                    })
                });
            }
        };

        return Controller;
    });

})(typeof define != "undefined" ? define : function () {
    var result = arguments[arguments.length - 1]();
    if ("undefined" != typeof(result)) {
        module.exports = result;
    }
});