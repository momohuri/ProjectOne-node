define([
    "../model/event",
    'extern/jquery-ui'

], function (Mevent) {

    function dateTimePicker() {
        require(["extern/jquery-ui-timepicker-addon"],function(){
            var startDateTextBox = $('#startDate');
            var endDateTextBox = $('#endDate');

            startDateTextBox.datetimepicker({
                onClose: function(dateText, inst) {
                    if (endDateTextBox.val() != '') {
                        var testStartDate = startDateTextBox.datetimepicker('getDate');
                        var testEndDate = endDateTextBox.datetimepicker('getDate');
                        if (testStartDate > testEndDate)
                            endDateTextBox.datetimepicker('setDate', testStartDate);
                    }
                    else {
                        endDateTextBox.val(dateText);
                    }
                },
                onSelect: function (selectedDateTime){
                    endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate') );
                }
            });
            endDateTextBox.datetimepicker({
                onClose: function(dateText, inst) {
                    if (startDateTextBox.val() != '') {
                        var testStartDate = startDateTextBox.datetimepicker('getDate');
                        var testEndDate = endDateTextBox.datetimepicker('getDate');
                        if (testStartDate > testEndDate)
                            startDateTextBox.datetimepicker('setDate', testEndDate);
                    }
                    else {
                        startDateTextBox.val(dateText);
                    }
                },
                onSelect: function (selectedDateTime){
                    startDateTextBox.datetimepicker('option', 'maxDate', endDateTextBox.datetimepicker('getDate') );
                }
            });
        });
    }

    var app = {
        init:function () {

            dateTimePicker();
            var model = Mevent.init('event');
            model.model().clear();
            $('#event').on('submit',function(event){
                event.preventDefault();
                model.model().attributes.Date = $.datepicker.formatDate('yy-mm-dd', new Date(model.model().attributes.Date.toString().split(' ')[0])) + ' ' + model.model().attributes.Date.toString().slice(11,16);
                model.model().attributes.DateEnd = $.datepicker.formatDate('yy-mm-dd', new Date(model.model().attributes.DateEnd.toString().split(' ')[0])) + ' ' + model.model().attributes.DateEnd.toString().slice(11,16);
                Mevent.create(model);
              //console.log(model.model().attributes.DateEnd+" "+model.model().attributes.Type);
                return false
            });
            require(["helpers/googlemaps"],function(maps){
                $('#inputPlace')
                    .on('changeLatLng',function(event,lat,lng){
                    model.model().set("lat",lat);
                    model.model().set("lng",lng);
                    maps.centerOnPlace(lat,lng);
                    }).on('changeAddress',function(event,address){
                    model.model().set("Address",address);
                });


                maps.autocomplete();
            });
        }
    }
    return app;

});

