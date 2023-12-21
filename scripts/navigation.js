var navMenuButton = document.querySelector(".navMenuButton")
var navCloseButton = document.querySelector(".navCloseButton")
var navList = document.querySelector(".navList")
var navUnderlay = document.getElementById("navUnderlay")

navMenuButton.addEventListener("click", function(){
    navList.setAttribute("style", "right: 0px");
    navUnderlay.setAttribute("style", "visibility: visible");
})

navCloseButton.addEventListener("click", function(){
    navUnderlay.setAttribute("style", "visibility: hidden");
    navList.setAttribute("style", "right: -200px");
})

navUnderlay.addEventListener("click", function(){
    navUnderlay.setAttribute("style", "visibility: hidden");
    navList.setAttribute("style", "right: -200px");
})

var mql = window.matchMedia("(max-width: 720px)");

function screenTest(e) {
    navUnderlay.setAttribute("style", "visibility: hidden");
    navList.setAttribute("style", "right: -200px");
}

//mql.addListener(screenTest);