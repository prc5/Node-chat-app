var socket = io();

socket.on('connect', function () {
    console.log('connected to server');
});

socket.on('disconnect', function () {
    console.log('disconnected to server');
});

socket.on('newMessage', function (message) {
    let formatedTime = moment(message.createdAt).format('h:mm a');
    let li = jQuery("<li></li>");
    li.text(`${message.from} ${formatedTime}: ${message.text}`);
    
    jQuery("#messages").append(li);
});

socket.on('newLocationMessage', function (message) {
    let formatedTime = moment(message.createdAt).format('h:mm a');
    let li = jQuery("<li></li>");
    let a = jQuery("<a target='_blank'>My current location</a>");
    li.text(`${message.from}  ${formatedTime}: `);
    a.attr('href', message.url)
    li.append(a);
    jQuery("#messages").append(li);
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();
    
    var messageTextbox = jQuery('[name=message]');
    
    socket.emit('createMessage', {
        from: "User",
        text: messageTextbox.val()
    }, function() {
        messageTextbox.val('');
    })
})

let locationButton = jQuery("#sendLocation");
locationButton.on('click', function() {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }
    
    locationButton.attr('disabled', 'disabled').text('Sending...')
    
    navigator.geolocation.getCurrentPosition(function(pos) {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
        })
    }, function() {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    })
})