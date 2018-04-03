var socket = io();

socket.on('connect', function () {
    console.log('connected to server');
});

socket.on('disconnect', function () {
    console.log('disconnected to server');
});

socket.on('newMessage', function (message) {
    let li = jQuery("<li></li>");
    li.text(`${message.from}: ${message.text}`);
    
    jQuery("#messages").append(li);
});

socket.on('newLocationMessage', function (message) {
    let li = jQuery("<li></li>");
    let a = jQuery("<a target='_blank'>My current location</a>");
    li.text(`${message.from}: `);
    a.attr('href', message.url)
    
    jQuery("#messages").append(li,a);
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();
    
    socket.emit('createMessage', {
        from: "User",
        text: jQuery('[name=message]').val()
    }, function() {
        
    })
})

let locationButton = jQuery("#sendLocation");
locationButton.on('click', function() {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }
    navigator.geolocation.getCurrentPosition(function(pos) {
        socket.emit('createLocationMessage', {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
        })
    }, function() {
        alert('Unable to fetch location');
    })
})