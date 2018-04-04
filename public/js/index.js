let socket = io();


socket.on('connect', function () {
    socket.emit('rooms', function(rooms) {
        console.log(rooms)
    })
});
socket.on('getRoomsList', function(rooms) {
    if(!rooms.length) {
        jQuery('<option/>').val('').html("No active rooms").appendTo('#rooms');
        jQuery('#rooms').attr('disabled', 'disabled');
    } else {
        jQuery("#rooms").removeAttr('disabled');
    }
    rooms.forEach(function(room) {       
        jQuery('<option/>').val(room).html(room).appendTo('#rooms');
    })
})

jQuery("#rooms").change(function() {
    jQuery('#roomName').val("");
    jQuery('#roomName').val($(this).val());
    console.log($(this).val());
})