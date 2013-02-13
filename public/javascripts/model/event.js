define([
    '../helpers/dao',
    "../helpers/function",
    "../extern/bootstrap-list"
], function (dao, functionH) {

    var event = new Backbone.Model(
        {
            id:'',
            Name:'',
            Description:'',
            Date:'',
            DateEnd:'',
            Address:'',
            Type:'',
            lat:'',
            lng:'',
            Creator_id:'',
            HasCreator:'',
            Link:''
        });
    event.prototype = Backbone.Model.prototype;
    event.prototype.joinEvent = function(){
        dao.QueryOnline('joinEvent', {id:this.attributes.id},function (res) {
            if(res.err){
                functionH.alert("event", res.err);
            }else{
                functionH.success("testIsLogged", res.succ);
            }
        });
    };
    event.prototype.shareEventByMail = function(emails,name){
        dao.QueryOnline('shareEventByMail', {email:emails,eventLink:this.attributes.Link, name:name},function (res) {
            if(!res.err){
                functionH.success("testIsLogged", res.succ);
            }else{
                functionH.alert("testIsLogged", res.err);
            }
        });
    };
    event.prototype.resetEvent = function(){
       event.set(
           {
               id:'',
               Name:'',
               Description:'',
               Date:'',
               DateEnd:'',
               Address:'',
               Type:'',
               lat:'',
               lng:'',
               Creator_id:'',
               HasCreator:'',
               Link:''
           }
       );
    };


    var app = {
        init:function (div) {
            event.resetEvent();
            var view_model = kb.viewModel(event);
            ko.applyBindings(view_model, $('#' + div)[0]);
            return view_model;
        },
        create:function (event) {
            dao.QueryOnline('addEvent', event.model().attributes,
                function (res) {
                    if(res.err){
                        functionH.alert("event", res.err);
                    }else{
                        window.location.hash = 'eventDescription/'+res.id;
                    }
                });
        },
        getEvent:function (lat, lng, distance,date,dateEnd,categorie, next) {
            dao.QueryOnline('getEvent', {lat:lat, lng:lng, distance:distance,date:date,dateEnd:dateEnd,categorie:categorie},
                function (res) {
                    next(res);
                });
        },
        getMyEventsOnline:function(next){
            dao.QueryOnline('getMyEvents',{},function(res){
                next(res);
            });
        },
        getMembersByEvent:function(id,next){
            dao.QueryOnline('getMembersByEvent',{id:id},
                function(res){
                    next(res);
            });
        },getCreatorByEvent:function(id,next){
            dao.QueryOnline('getCreatorByEvent',{id:id},
                function(res){
                    next(res);
                });
        },
        getMyEventsOffline:function(next){
            dao.QueryOffline('events', {}, function (res) {
                next(res);
            });
        },
        getEventById:function (id, next) {
            dao.QueryOnline('getEventById', {id:id},
                function (res) {
                    next(res);
                });
        },
        createList:function (events) {
            function listChangeHandler(event) {
                //todo pas faire le require if offline
                if (event.item.lat != undefined) {
                    require(["helpers/googlemaps"],function(gmaps){
                        gmaps.centerOnPlace(event.item.lat, event.item.lng);

                    })
                }
                event.item.Date = new Date(event.item.Date).toLocaleString();
                event.item.DateEnd = new Date(event.item.DateEnd).toLocaleString();
                $('#myList').list.showModal(event.item);
            }

            function createDataProvider(events) {
                var result = [];
                events.forEach(function (item) {
                    result.push(item)
                });

                return result;
            }

            function empty() {
                return [0];
            }
            
            function listItemLabelFunction(item) {
                if(item!=0){
                    var date= new Date(item.Date);
                    var dateEnd= new Date(item.DateEnd);
                    var descrition =item.Name+" du "+date.toLocaleDateString()+" au "+dateEnd.toLocaleDateString()+"<br>Categorie:"+item.Type;
                }else{
                    var descrition = "Il n'y a pas d'Evenement... Cree le votre"
                }

                return descrition;
            }
            var myList= $('#myList');
            if (events.length!=0) {
                myList.list('setDataProvider', createDataProvider(events));
            } else {
                myList.list('setDataProvider', empty())
            }

            myList.list('setLabelFunction', listItemLabelFunction);

            myList.on('change', listChangeHandler);

            $('div.list').attr('class','list padding2');

            $.fn.list.showModal=function(self){
                $('#myModal').modal();

                event.set(self);
                if(self.Creator_id){
                    event.set("HasCreator",true);
                    if (self.Link) {
                    }else{
                        event.set("Link","/#eventDescription/"+self.id);
                    }
                }else{
                    event.set("HasCreator",false);
                }
            }
        }


    };
    return app;

});