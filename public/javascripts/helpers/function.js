define([
    '../extern/jquery-ui'
], function () {
    var app = {
        isConnected:function (next) {
            $.ajax({
                type:'POST',
                url:'isConnected',
                success:function () {
                    next(true);
                },
                error:function () {
                    next(false);
                }
            });
        },
        alert:function (idForm,error){
            var err='';
            for(item in error){
                for(var i=0; i<error[item].length;i++){
                    err+=error[item][i]+'<br/>';
                }
            };
            $('.alert').remove();
            $('#'+idForm).append('<div style="margin-top:10px;" class="alert alert-error"><button type="button" id="close" class="close" data-dismiss="alert">×</button>' + err + '</div>');
            $("#close").on("click",function(){
                $("#close").off();
                $('.alert').remove();
            });
        },
        success:function (idForm,error){
            var succ='';
            for(item in error){
                for(var i=0; i<error[item].length;i++){
                    succ+=error[item][i]+'<br/>';
                }
            };
            $('.alert').remove();
            $('#'+idForm).append('<div style="margin-top:10px;" class="alert alert-success"><button id="close" type="button" class="close" data-dismiss="alert alert-success">&times;</button>' + succ + '</div>');
            $("#close").on("click",function(){
                $("#close").off();
                $('.alert').remove();
            });
        },

        //remove null from json
        remove_empty: function ( target ) {
            Object.keys( target ).map( function ( key ) {
                if ( target[ key ] instanceof Object ) {
                    if ( ! Object.keys( target[ key ] ).length ) {
                        delete target[ key ];
                    }else if (Object.keys( target[ key ] ).length==0){
                        delete target[ key ];
                    }
                    else {
                        remove_empty( target[ key ] );
                    }
                }
                else if ( target[ key ] === null ) {
                    delete target[ key ];
                } else if (target[ key ] == '' ) {
                    delete target[ key ];
                }
            });
            return target;
        },

        //datePicker
        dateTimePicker:function() {
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
                onSelect: function (selectedDateTime){$("#ui-datepicker-div").css("z-index", "9999");
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

    }
    return app;

});