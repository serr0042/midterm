// VARIABLES
var pages = [], links = [];
var numLinks = 0;
var numPages = 0;
var pageTime = 800;
var lat;
var long;

// CREATE PAGESHOW EVENT
var pageshow = document.createEvent( "CustomEvent" );
pageshow.initEvent( "pageShow", false, true );

document.addEventListener("deviceready", function() {
    console.log("deviceready");
    findContact();
});

// LOADING THE DOCUMENT
document.addEventListener( "DOMContentLoaded", function()
{
    pages = document.querySelectorAll('[data-role="page"]');
    numPages = pages.length;
    links = document.querySelectorAll('[data-role="pagelink"]');
    numLinks = links.length;
    
    for(var i=0; i<numLinks; i++)
    {
        links[i].addEventListener("click", handleNav, false);
    }
    
    //add the listener for pageshow to each page
    for(var p=0; p<numPages; p++)
    {
        pages[p].addEventListener("pageShow", handlePageShow, false);
    }
    
    loadPage(null);
    
    console.log("DOM Loaded");
    
    // run functions, run!
    detectTouchSupport();
    checkMap();
});

// CREATE A CONTACT
function createContact()
{
    var myContact = navigator.contacts.create( {"displayName":"Test User"} );
    myContact.note = "This contact has a note.";
    console.log( "The contact, " + myContact.displayName + ", note: " + myContact.note );
};

// FINDING CONTACTS
function findContact()
{
    var options = new ContactFindOptions();
    options.filter = "";
    options.multiple = true;
    var fields = [ "displayName", "name" ];
    navigator.contacts.find( fields, onSuccess, onError, options );
};



// CHECK FOR TOUCH SUPPORT
function detectTouchSupport()
{
    msGesture = navigator && navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 && MSGesture;
    touchSupport = (( "ontouchstart" in window ) || msGesture || ( window.DocumentTouch && document instanceof DocumentTouch ));
    console.log( "touch support checked" );
    
    return touchSupport;
};

// ADD TOUCH HANDLERS
function touchHandler(ev)
{
    if( ev.type == "touchend" )
    {
        ev.preventDefault();
        
        var touch = ev.changedTouches[0];
        var newEvt = document.createEvent( "MouseEvent" );
        
        newEvt.initMouseEvent( "click", true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY );
        ev.currentTarget.dispatchEvent( newEvt );
    }
};

// NAV BAR EVENTS
function handleNav(ev)
{
    ev.preventDefault();
    var href = ev.target.href;
    var parts = href.split( "#" );
    loadPage( parts[1] );
    return false;
};

// PAGE SHOW EVENTS
function handlePageShow(ev)
{
    ev.target.className = "active";
};

// THE LOADING PROCESS FOR EACH TAB
function loadPage( url )
{
    if( url == null )
    {
        //home page first call
        pages[0].className = "active";
        history.replaceState( null, null, "#home" );
    }
    else
    {
        for( var i=0; i<numPages; i++ )
        {
            pages[i].className = "hidden";
            //get rid of all the hidden classes
            //but make them display block to enable anim.
            if( pages[i].id == url )
            {
                pages[i].className = "show";
                //add active to the proper page
                history.pushState( null, null, "#" + url );
                setTimeout( addDispatch, 50, i );
            }
        }
        //set the activetab class on the nav menu
        for( var t=0; t<numLinks; t++ )
        {
            links[t].className = "";
            if( links[t].href == location.href ){
                links[t].className = "activetab";
            }
        }
    }
};

// ADD DISPATCH FUNCTION
function addDispatch( num )
{
    pages[num].dispatchEvent( pageshow );
};

// GET GEOLOCATION FOR MAP
function checkMap()
{
    if( navigator.geolocation )
    {
        var params = {enableHighAccuracy: false, timeout:60000, maximumAge:60000};
        navigator.geolocation.getCurrentPosition(
            reportPosition, gpsError, params );
    }
    else
    {
        alert( "Sorry, but your browser does not support this feature." )
    }
};

// REPORT USER'S POSITION TO VARIABLES
function reportPosition( position )
{
    lat = position.coords.latitude;
    long = position.coords.longitude;
    createCanvas();
};

// CREATE THE CANVAS AND APPEND MAP TO IT
function createCanvas()
{
    var div = document.getElementById( "output" );
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

// IN CASE THERE IS A MAP ERROR
function gpsError( error )
{
    var errors = {
        1: "Permission denied",
        2: "Position unavailable",
        3: "Request timeout",
    };
    alert( "Error: " + errors[ error.code ] );
};

// IF FINDING CONTACTS IS SUCCESSFUL
function onSuccess(contacts) 
{
    var c = Math.floor(Math.random() * contacts.length); //getting random whole number
    var newPerson = document.getElementById("newPerson");
    newPerson.innerHTML = "Name: " + contacts[c].name.formatted + "<br>" + "Phone: " + contacts[c].phoneNumbers[0].value; //name and first phone number
};

// IF FINDING CONTACTS IS A HUGE FAILURE . . . BOO
function onError(contactError)
{
    console.log( "onError!" );
};



                        