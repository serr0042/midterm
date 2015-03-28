var lat;
var long;

document.addEventListener("deviceready", function(){
    findContact();
});

document.addEventListener("DOMContentLoaded", function(){
    detectTouchSupport();
    
    getLocation();
    
});

function detectTouchSupport(){
    msGesture = navigator && navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 && MSGesture;
    touchSupport = (("ontouchstart" in window) || msGesture || (window.DocumentTouch && document instanceof DocumentTouch));
    return touchSupport;
};

function touchHandler(ev){
    if(ev.type == "touchend"){
        ev.preventDefault();
        var touch = ev.changedTouches[0];
        var newEvt = document.createEvent("MouseEvent");
        newEvt.initMouseEvent("click",true,true,window,1,touch.screenX,touch.screenY,touch.clientX,touch.clientY);
        ev.currentTarget.dispatchEvent(newEvt);
    }
};
function findContact(){
    var options = new ContactFindOptions();
    options.filter = "";
    options.multiple = true;
    var fields = ["displayName", "name", "phoneNumber"];
    navigator.contacts.find(fields, onSuccess, onError, options);
};

function onSuccess(contacts){
    var c = Math.floor(Math.random() * contacts.length);
    var newPerson = document.getElementById("newPerson");
    newPerson.innerHTML = "Name:" + contacts[c].name.formatted;
};

function onError(contactError){
    console.log("ERROR");
};


function getLocation(){
    if(navigator.geolocation){
        var params = {enableHighAccuracy:false, timeout:60000, maximumAge:60000};
        navigator.geolocation.getCurrentPosition(reportPosition, gpsError, params);
    }else{
        alert("Sorry, your device does not support this feature");
    }
};

function reportPosition(position){
    lat = position.coords.latitude;
    long = position.coords.longitude;
    createCanvas();
};

function gpsError(error){
    var errors = {
        1: "Permission denied",
        2: "Position unavailable",
        3: "Request timeout",
    };
    alert("Error: " + errors[error.code]);
}

function createCanvas()
{
    var div = document.getElementById( "map-canvas" );
    var canvas = document.createElement( "canvas" );
    canvas.setAttribute( "width", "400" );
    canvas.setAttribute( "height", "400" );
    div.appendChild( canvas );
    var context = canvas.getContext( "2d" );
    var img = new Image( 400,400 );
    
    img.onload = function()
    {
        context.drawImage( img, 0, 0 );
    }
    
    img.src = "http://maps.googleapis.com/maps/api/staticmap?&zoom=14&size=400x400&maptype=roadmap&markers=color:blue%7Clabel:A%7C"+lat+","+long+"&center="+lat+","+long;
};


