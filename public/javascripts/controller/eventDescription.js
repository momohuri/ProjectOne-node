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
                var dateEndFormat = new Date(event.Date);
                event.Date = dateFormat.toLocaleString();
                event.DateEnd = dateEndFormat.toLocaleString();
                myEvent.model().set(event);
                if(myEvent.model().attributes.CreatorId == sessionStorage.userId){
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
                    var address = "";
                    $('#listEmailAddress .addressToSend').each(function(){
                        if($(this).val() != ""){
                            address += $(this).val()+";";
                        }
                    });
                    alert(address);
                    debugger
                    myEvent.model().shareEventByMail(address, sessionStorage.name+" "+sessionStorage.surname);
                });
            });
            var user = Muser.init('testIsLogged');
            var user = Muser.init('testCreator');
            var user = Muser.init('addComment');




            $('#addComment').on('submit',function(evt){
                //todo pas de model ici, moche la dao!!!!
                dao.QueryOnline('addComment', {idEvent:id,comment:{Comment:$('#comment')[0].value}},
                    function (res) {
                        if(!res.err){
                            $('#comments').prepend('<li>'+$('#comment')[0].value+'</li>');
                            $('#comment').val("");
                        }
                     });
                return false;
            });

        }
    }
    return app;
});

