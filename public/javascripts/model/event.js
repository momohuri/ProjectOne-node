define([
    '../helpers/dao',
    "../helpers/function",
    "../helpers/googlemaps",
    "../extern/bootstrap-list"


], function (dao, functionH, gmaps) {

    var event = new Backbone.Model(
        {
            Name:'',
            Description:'',
            Date:'',
            DateEnd:'',
            Address:'',
            Type:'',
            lat:'',
            lng:'',
            Link:''
        });


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
        createList:function (events) {
            function listChangeHandler(event) {
                if (event.item.lat != undefined) {
                    gmaps.centerOnPlace(event.item.lat, event.item.lng);
                    $('#myList').list.showModal(event.item);
                }
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
                event.set('Name',self.Name);
                event.set('Description',self.Description);
                event.set('Address',self.Address);
                event.set('Type',self.Type);
                event.set('Link',self.Link);
                event.set('Date',new Date(self.date).toLocaleString());
                $('#myModal').modal();
            }
        }


    };
    return app;

});