define([
    '../helpers/dao',
    "../helpers/function",
    "../extern/bootstrap-list"


], function (dao, functionH) {

    var event = new Backbone.Model(
        {
            Id:'',
            Name:'',
            Description:'',
            Date:'',
            DateEnd:'',
            Address:'',
            Type:'',
            lat:'',
            lng:'',
            Creator_id:'',
            Link:''
        });
    event.prototype = Backbone.Model.prototype;
    event.prototype.joinEvent = function(){
        dao.QueryOnline('joinEvent', {id:this.Id},function (res,next) {
            debugger
            if(res.err){
            functionH.alert("event", res.err);
        }else{
             next(res);
        }
    });
    };


    var app = {
        init:function (div) {
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
        getEvent:function (lat, lng, distance,date,dateEnd, next) {
            dao.QueryOnline('getEvent', {lat:lat, lng:lng, distance:distance,date:date,dateEnd:dateEnd},
                function (res) {
                    next(res);
                });
        },
        getMyEventsOnline:function(next){
            dao.QueryOnline('getMyEvents',{},function(res){
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
                if (event.item.lat != undefined) {
                    require(["helpers/googlemaps"],function(gmaps){
                        gmaps.centerOnPlace(event.item.lat, event.item.lng);

                    })
                }
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
                    var date= new Date(item.date);
                    var descrition =item.Name+" le "+date.toLocaleDateString()+"<br>Categorie:"+item.Type;
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
                event.set(self)
                debugger

            }
        }


    };
    return app;

});