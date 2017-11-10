var serverName = "noerric.com/noerric_image_acq/server.php";
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
        sentDataToServer("hello");
    },
    
};


function getImage(){
    navigator.camera.getPicture(success, fail, { quality: 50,
        destinationType: destinationType.DATA_URL });    
}



function success(imageData) {
    $(".b64p").empty();
    $(".b64p").append("image data");
    $(".b64p").append("data " + imageData);
    document.getElementById("image-id").src = "data:image/jpeg;base64," + imageData;
    sentDataToServer(imageData);   
}

function sentDataToServer(imageData){
    $(".b64p").empty();
    $(".b64p").append("image-b64-sending-img-data - " + imageData);
    
     $.ajax({
        url : "http://" + serverName,
        type : "post",
        data : "action=img-data-b64&imageData="+imageData,
        async : true,
        success : function(resp){
            $(".b64p").empty();
            $(".b64p").append("image-b64-sent - resp :" + resp);
            
        },
        error :  function(jqXHR, textStatus, errorThrown){
            console.log(textStatus, errorThrown);
            //var str = "<li><div class=\"divider\"></div></li><li><a class=\"subheader\">Developer</a></li><li><a class=\"waves-effect\" href=\"https://www.facebook.com/profile.php?id=100005595785739\" $
            //$(".nav-bar-div").append(str);
        }
    });

}


function fail(error) { 
    alert(error); 
}
