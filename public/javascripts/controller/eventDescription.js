define([
    "../model/event",
    "../model/user",
    "../helpers/dao",
    "../helpers/function",
    "../extern/date"


], function (Mevent,Muser,dao,functionH) {

    function getMembersByEvent(id){
        Mevent.getMembersByEvent(id,function(events){
            var viewModel = {
                members: ko.observableArray(events)
            };
            ko.applyBindings(viewModel,$("#listMembers")[0]);

        });
    }
    function getCreatorByEvent(id){
        Mevent.getCreatorByEvent(id,function(creator){
                var viewModel = {
                    creator: creator
                };
                ko.applyBindings(viewModel,$("#creator")[0]);
        });
    }
    function getComment(id){
        dao.QueryOnline('getComments',{idEvent:id},function(comments){
            var viewModel = {
                comments: ko.observableArray(comments)
            };
            ko.applyBindings(viewModel,$("#comments")[0]);
        })
    }

    var app = {

        init:function (id) {
            var myEvent = Mevent.init('eventDescription');
            getMembersByEvent(id);
            getCreatorByEvent(id);
            getComment(id);
            Mevent.getEventById(id,function(event){
                var dateFormat = new Date(event.Date);
                var dateEndFormat = new Date(event.DateEnd);
                event.Date = dateFormat.toLocaleString();
                event.DateEnd = dateEndFormat.toLocaleString();
                myEvent.model().set(event);
                if(myEvent.model().attributes.CreatorId == localStorage.userId){
                    user.model().set("IsCreator",true);
                }else{
                    user.model().set("IsCreator",false);
                }
                if(myEvent.model().attributes.IsMember){
                    user.model().set("IsMember",true);
                }else{
                    user.model().set("IsMember",false);
                }
                $('#joinEvent').on('submit',function(event){
                    myEvent.model().joinEvent();
                    user.model().set("IsMember",true);
                    return false;
                });
                $('#listAdress').on('submit',function(evt){
                    if($('#address')[0].value != ""){
                        $('#listEmailAddress').prepend('<input type="text" class="addressToSend" style="display:block;" value="'+$('#address')[0].value+'" />');
                        $('#address').val("");
                    }
                });

                $('#sendMail').on('submit',function(evt){
                    var bool = false;
                    var address = "";
                    $('#listEmailAddress .addressToSend').each(function(){
                        if($(this).val() != ""){
                            if(bool){
                                address += ",";
                            }
                            address += $(this).val();
                            bool = true;
                        }
                    });
                    myEvent.model().shareEventByMail(address, localStorage.name+" "+localStorage.surname);
                    return false;
                });
            });
            var user = Muser.init('testIsLogged');
            var user = Muser.init('testCreator');
            var user = Muser.init('testCreator2');
            var user = Muser.init('addComment');




            $('#addComment').on('submit',function(evt){
                //todo pas de model ici, moche la dao!!!!
                if($('#comment')[0].value != ""){
                dao.QueryOnline('addComment', {idEvent:id,comment:{Comment:$('#comment')[0].value}},
                    function (res) {
                        if(!res.err){
                            $('#comments').prepend('<li><span style="margin: 0;font-weight: bold;">'+localStorage.surname+" "+localStorage.name+' </span>'+
                            '<span style="margin: 0;font-style: italic">"'+$('#comment')[0].value+'"</span>'+
                                '<p style="text-align: right;font-style: italic;color: #AAAAAA;"><small><span>à '+new Date().toLocaleTimeString()+' le '+new Date().toDateString()+'</span></small></p>'+
                                '<hr style="margin: 0;">'+
                                '</li>');
                            $('#comment').val("");
                        }
                     });
                }
                return false;
            });

        }
    }
    return app;
});

