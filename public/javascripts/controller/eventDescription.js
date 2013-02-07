define([
    "../model/event",
    "../model/user",
    "../extern/date"
], function (Mevent,Muser) {

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

    var app = {

        init:function (id) {
            var myEvent = Mevent.init('eventDescription');
            getMembersByEvent(id);
            getCreatorByEvent(id);
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
                });
            });
            var user = Muser.init('testIsLogged');



        }
    }
    return app;
});

