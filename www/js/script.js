var modal;
var personList = [];
var loadCount = 0;
var myID;

localStorage.clear();

document.addEventListener("DOMContentLoaded", function(){
    
  
    loadCount ++;
    if (loadCount === 2){
        startApp();
    }
});

document.addEventListener("deviceready", function(){
 
    loadCount ++;
    if (loadCount === 2){
        startApp();
    }
});

function startApp() {
    
    
    //back button listener
    var backbtn = document.getElementById('back');
    var ht3 = new Hammer(backbtn);
    ht3.on('tap', function(){
         document.querySelector("[data-role=list]").style.display="block";
        document.querySelector("[data-role=map]").style.display="none";  
    });
    
    //check to see if local storage exists
    if(localStorage.getItem("serr0042"))
    {
        alert("boooo");
        personList = JSON.parse(localStorage.getItem("serr0042"));
    }else{
        var options = new ContactFindOptions();
        options.filter = "";
        options.multiple = true;
        filter = ["displayName"];
        navigator.contacts.find(filter, onSuccess, onError, options);
    };
   
};

function onSuccess(contacts) {
    
    for (i = 0; i < 12; i++){
    
        var newPerson = {id:(contacts[i].id),
                        name:(contacts[i].name.formatted),
                         numbers:(contacts[i].phoneNumbers[0].value),
                         lat:"",lng:""};
        
         personList.push(newPerson);
                                          
    }
    //create the localstorage
    localStorage.setItem("serr0042", JSON.stringify(personList));
    
    console.log(personList);
     showContacts();   
    
};


function showContacts(){
    
var contactDiv = document.getElementById('contactsList');
var ul = document.getElementById('conL');
    
for (var i=0;i<12;i++){
    
    var li = document.createElement("li");
    
    li.innerHTML = personList[i].name;
    li.setAttribute("id",i);
    ul.appendChild(li);
    
}

    
var mc = new Hammer.Manager(contactDiv);

mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2}) );

mc.add( new Hammer.Tap({ event: 'singletap' }) );

mc.get('doubletap').recognizeWith('singletap');

mc.get('singletap').requireFailure('doubletap');

mc.on("singletap", showModal);

mc.on("doubletap", startMap);

    
    
};

function showModal(ev){
    
   
    var personName = document.getElementById("name");
    var personNum = document.getElementById("num");
    
    personName.innerHTML = personList[ev.target.id].name;
    personNum.innerHTML = personList[ev.target.id].numbers;
    
    
    //show it!
    document.querySelector("[data-role=modal]").style.display="block";
    document.querySelector("[data-role=overlay]").style.display="block";
    
    
    
    var cancelButton = document.getElementById('cancel');
   
    var ht2 = new Hammer(cancelButton);
    ht2.on('tap', hideModal);
    
};


function hideModal(){
    document.querySelector("[data-role=modal]").style.display="none";
    document.querySelector("[data-role=overlay]").style.display="none";
    
}

function onError(contactError) {
    console.log("Contact Error");
};


/************************************

MAP STUFF

*************************************/

var map;
var marker;

function placeMarker(location){
    
    marker = new google.maps.Marker({
        position: location,
        map: map    
    });
    //center the map
    map.setCenter(location);
    //change the contacts stuff
    personList[myID].lat = marker.getPosition().lat();
    personList[myID].lng = marker.getPosition().lng();
    
    //put this in local storage now
    localStorage.setItem("serr0042", JSON.stringify(personList));
    
    
};
function startMap(ev){
    
    console.log(ev);
    
    var mapOptions = {
        disabledDoubleClickZoom:true,
        zoom: 6
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);

            var infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: 'Location found using HTML5.'
            });

            map.setCenter(pos);
        }, function () {
            handleNoGeolocation(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }

    
    
    
    
    document.querySelector("[data-role=list]").style.display="none";
    document.querySelector("[data-role=map]").style.display="block";
    
    if (personList[ev.target.id].lat === ""){
        
        myID = ev.target.id;
        
        google.maps.event.addListener(map, 'dblclick', function(event){
            
            placeMarker(event.latlng);
        })
        
    }else{
        
        var myLocation = new google.maps.LatLng(personList[ev.target.id].lat, personList[ev.target.id].lng)
        
        //set the marker in this contacts spot
        marker = new google.maps.Marker({
        position: myLocation,
        animation: google.maps.Animation.BOUNCE,
        map: map   
    });
         //center the map
    map.setCenter(myLocation);
        
    };
    
};


//function initialize() {
//    alert("map");
//    var mapOptions = {
//        disabledDoubleClickZoom:true,
//        zoom: 6
//    };
//    map = new google.maps.Map(document.getElementById('map-canvas'),
//        mapOptions);
//
//    // Try HTML5 geolocation
//    if (navigator.geolocation) {
//        navigator.geolocation.getCurrentPosition(function (position) {
//            var pos = new google.maps.LatLng(position.coords.latitude,
//                position.coords.longitude);
//
//            var infowindow = new google.maps.InfoWindow({
//                map: map,
//                position: pos,
//                content: 'Location found using HTML5.'
//            });
//
//            map.setCenter(pos);
//        }, function () {
//            handleNoGeolocation(true);
//        });
//    } else {
//        // Browser doesn't support Geolocation
//        handleNoGeolocation(false);
//    }
//}
//google.maps.event.addDomListener(window, 'load', initialize);


function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}

