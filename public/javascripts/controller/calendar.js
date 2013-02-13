define([
    "../model/event",
    "../model/user",
    "../helpers/dao",
    "../helpers/function",
    "../extern/date",
    "../extern/fullcalendar"
], function (Mevent,Muser,dao,functionH) {

    var app = {
        init:function () {
            var model = Mevent.init('myModal');
            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            Mevent.getMyEventsOnline(function(events){
                    if (typeof(events) != 'undefined') {
                        var eventList =[];
                        var bool = false;
                        events.forEach(function(event){
                            if(typeof(event) != 'undefined' ){
                                var eventToAdd = {
                                title: event.Name,
                                start: new Date(event.Date),
                                end: new Date(event.DateEnd),
                                allDay: false,
                                color:"",
                                address: event.Address,
                                category: event.Type,
                                description: event.Description,
                                link:""
                                }
                                if(event.Link != null){
                                    eventToAdd.link = event.Link;
                                }else{
                                    eventToAdd.link = "/#eventDescription/"+event.id;
                                }
                                eventList.push(eventToAdd);
                            }
                        });
                        $('#calendar').fullCalendar({
                            header: {
                                left: 'prev,next today',
                                center: 'title',
                                right: 'month,agendaWeek,agendaDay'
                            },
                            editable: false,
                            selectable: true,
                            selectHelper: true,
                            eventClick: function(calEvent, jsEvent, view) {
                                model.model().set("Description", calEvent.description);
                                model.model().set("Date", new Date(calEvent.start).toLocaleString());
                                model.model().set("DateEnd", new Date(calEvent.end).toLocaleString());
                                model.model().set("Name", calEvent.title);
                                model.model().set("Address", calEvent.address);
                                model.model().set("Type", calEvent.category);
                                model.model().set("Link", calEvent.link);
                                $('#myModal').modal('show');
                            },
                            events: eventList
                        });
                    }
                }
            );


        }
    }
    return app;
});