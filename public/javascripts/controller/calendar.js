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
            var model = Mevent.init('myModal')
            Mevent.init('myModalAddEvent');

            functionH.dateTimePicker();

            //bug: modal passe devant si on fait pas ca.
            $('#startDate').on('click',function(){
                $("#ui-datepicker-div").css("z-index", "9999");
            });
            $('#endDate').on('click',function(){
                $("#ui-datepicker-div").css("z-index", "9999");
            });
            $('#inputPlace').on('input',function(){
                $('.pac-container').css("z-index", "9999");
            });
            require(["helpers/googlemaps"],function(maps){
                $('#inputPlace')
                    .on('changeLatLng',function(event,lat,lng){
                        model.model().set("lat",lat);
                        model.model().set("lng",lng);
                    }).on('changeAddress',function(event,address){
                        model.model().set("Address",address);
                    });
                maps.autocomplete();
            });

            $('#submit').on('click',function(event){
                event.preventDefault();
                model.model().attributes.Date = $.datepicker.formatDate('yy-mm-dd', new Date(model.model().attributes.Date.toString().split(' ')[0])) + ' ' + model.model().attributes.Date.toString().slice(11,16);
                model.model().attributes.DateEnd = $.datepicker.formatDate('yy-mm-dd', new Date(model.model().attributes.DateEnd.toString().split(' ')[0])) + ' ' + model.model().attributes.DateEnd.toString().slice(11,16);
                $('#myModalAddEvent').modal('hide');
                Mevent.create(model);
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
                eventClick: function(calEvent) {
                    model.model().set("Description", calEvent.description);
                    model.model().set("Date", new Date(calEvent.start).toLocaleString());
                    model.model().set("DateEnd", new Date(calEvent.end).toLocaleString());
                    model.model().set("Name", calEvent.title);
                    model.model().set("Address", calEvent.address);
                    model.model().set("Type", calEvent.category);
                    model.model().set("Link", calEvent.link);
                    $('#myModal').modal('show');
                },
                select: function(start, end) {
                    model.model().resetEvent();
                    var hours= (start.getHours()<=9)?'0'+start.getHours():start.getHours();
                    var min= (start.getMinutes()<=9)?'0'+start.getMinutes():start.getMinutes();
                    $('#startDate').val($.datepicker.formatDate('yy-mm-dd', new Date(start))+' '+hours+':'+min);
                    hours= (end.getHours()<=9)?'0'+end.getHours():end.getHours();
                    min= (end.getMinutes()<=9)?'0'+end.getMinutes():end.getMinutes();
                    $('#endDate').val($.datepicker.formatDate('yy-mm-dd', new Date(end))+' '+hours+':'+min);
                    model.model().set('date',$('#startDate').val());
                    model.model().set('dateEnd',$('#endDate').val());
                    $('#myModalAddEvent').modal('show');
                },
                events: '/getMyEvents'
            });
        }
    }
    return app;
});