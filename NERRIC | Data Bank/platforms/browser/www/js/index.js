var serverName = "nustfineartsclub.com/mess";
var pictureSource, destinationType;
var app = {

    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
    },
    
};


function getImage(){
    navigator.camera.getPicture(success, fail, { quality: 50,
        destinationType: destinationType.DATA_URL });    
}



function success(imageData) {
    $(".b64p").empty();
    $(".b64p").append(imageData);
}

function fail(error) { 
    alert(error); 
}
