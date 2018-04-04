var socket = io();

function scrollToBottom() {
    //Selectors
    let messages = jQuery('#messages');
    let newMessage = messages.children('li:last-child')
    //Heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();
    
    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight>= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    var params = jQuery.deparam(window.location.search);
    
    socket.emit('join', params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error')
        }
    })
});

socket.on('disconnect', function () {
    console.log('disconnected to server');
});

socket.on('updateUserList', function(users) {
    let ol = jQuery('<ol></ol>');
    
    users.forEach(function(user) {
        ol.append(jQuery('<li></li>').text(user));
        
        jQuery('#users').html(ol);
    })
})

socket.on('newMessage', function (message) {
    let formatedTime = moment(message.createdAt).format('h:mm a');
    let template = jQuery('#message-template').html();
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formatedTime
    });
    
    jQuery("#messages").append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
    let formatedTime = moment(message.createdAt).format('h:mm a');
matedTime = moment(message.createdAt).format('h:mm a');
    let template = jQuery('#location-template').html();
    let html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formatedTime
    });
    
    jQuery("#messages").append(html);
    scrollToBottom();
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();
    
    var messageTextbox = jQuery('[name=message]');
    
    socket.emit('createMessage', {
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