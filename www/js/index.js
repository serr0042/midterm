var pages = [], links = [];
var numLinks = 0;
var numPages = 0;
var pageTime = 800;

var pageshow = document.createEvent("CustomEvent");
pageshow.initEvent("pageshow", false, true);

document.addEventListener("deviceready", function(){
    findContact();
});

document.addEventListener("DOMContentLoaded", function(){
    pages = document.querySelectorAll('[data-role="page"]');
    numPages = pages.length;
    links = document.querySelectorAll('[data-role="pagelink"]');
    numLinks = links.length;
    
    for(var i=0; i<numLinks; i++){
        links[i].addEventListener("click", handleNav, false);
    }
    
    for(var p=0; p<numPages; p++){
        pages[p].addEventListener("pageshow", handlePageShow, false);
    }
    loadPage(null);
    detectTouchSupport();
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

function handleNav(ev){
    ev.preventDefault();
    var href = ev.target.href;
    var parts = href.split("#");
    loadPage(parts[1]);
    return false;
};

function handlePageShow(ev){
    ev.target.className = "active";
};

function loadPage(url){
    if(url == null){
        pages[0].className = "active";
        history.replaceState(null, null, "#contactDiv");
    }else{
        for(var i=0; i<numPages; i++)
        {
            pages[i].className = "hidden";
            
            if(pages[i].id == url){
                pages[i].className = "show";
                history.pushState(null, null, "#" + url);
                setTimeout(addDispatch, 50, i);
            }
        }
        for(var t=0; t<numLinks; t++){
            links[t].className = "";
            if(links[t].href == location.href){
                links[t].className = "activetab";
            }
        }
    }
};

function addDispatch(num){
    pages[num].dispatchEvent(pageshow);
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