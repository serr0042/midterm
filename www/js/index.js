var pages = [], links [];
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