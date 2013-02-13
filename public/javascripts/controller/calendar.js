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
                                url: ""
                                }
                                if(event.Link != null){
                                    eventToAdd.url = event.Link;
                                }else{
                                    eventToAdd.url = "/#eventDescription/"+event.id;
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
                            select: function(start, end, allDay) {
                                var title = prompt('Event Title:');
                                var title = prompt('Event Title:');
                                var title = prompt('Event Title:');
                                var title = prompt('Event Title:');
                                var title = prompt('Event Title:');
                                if (title) {
                                    calendar.fullCalendar('renderEvent',
                                        {
                                            title: title,
                                            start: start,
                                            end: end,
                                            allDay: allDay
                                        },
                                        true // make the event "stick"
                                    );
                                }
                                calendar.fullCalendar('unselect');
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