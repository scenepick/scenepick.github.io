//localStorage.setItem("showHelp", "true");
const showHelp = localStorage.getItem("showHelp");

var exportModal = document.getElementById("exportModal");
var exportUnderlay = document.getElementById("exportUnderlay");
var exportCloseButton = document.getElementById("exportCloseButton");
var exportButton = document.getElementById("exportButton");

var helpModal = document.getElementById("helpModal");
var helpUnderlay = document.getElementById("helpUnderlay");
var helpCloseButton = document.getElementById("helpCloseButton");
var helpButton = document.getElementById("helpButton");
var hideHelpButton = document.getElementById("hideHelpButton");

var helpVideo = document.getElementById("helpVideo");
var sceneExportVideo = document.getElementById("sceneExportVideo");
var framesExportVideo = document.getElementById("framesExportVideo");

var helpPlayer;
var sceneExportPlayer;
var framesExportPlayer;

function onYouTubePlayerAPIReady() {
    helpPlayer = new YT.Player("helpVideo");
    sceneExportPlayer = new YT.Player("sceneExportVideo");
    framesExportPlayer = new YT.Player("framesExportVideo");
};

closeExportModal()

exportButton.addEventListener("click", function(){
    openExportModal();
});

exportUnderlay.addEventListener("click", function(){
    closeExportModal();
});

exportCloseButton.addEventListener("click", function(){
    closeExportModal();
});

function openExportModal(){
    exportModal.setAttribute("style", "visibility: visible");
    exportUnderlay.setAttribute("style", "visibility: visible");
};

function closeExportModal(){
    exportModal.setAttribute("style", "visibility: hidden");
    exportUnderlay.setAttribute("style", "visibility: hidden");
    stopVideos()
};

function openExportContent(evt, name) {
    var i, tabContent, tabButton;
  
    tabContent = document.getElementsByClassName("tabContent");
    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = "none";
    };
  
    tabButton = document.getElementsByClassName("tabButton");
    for (i = 0; i < tabButton.length; i++) {
      tabButton[i].className = tabButton[i].className.replace(" active", "");
    };
  
    document.getElementById(name).style.display = "block";
    evt.currentTarget.className += " active";

    stopVideos()
}

document.getElementById("exportDefault").click();

closeHelpModal();

if(showHelp == "false"){
    closeHelpModal();
    hideHelpButton.setAttribute("style", "display: none");
}else if(showHelp == "true"){
    openHelpModal();
}else{
    openHelpModal();
    localStorage.setItem("showHelp", "true");
};

function openHelpModal(){
    helpModal.setAttribute("style", "visibility: visible");
    helpUnderlay.setAttribute("style", "visibility: visible");
};

function closeHelpModal(){
    helpModal.setAttribute("style", "visibility: hidden");
    helpUnderlay.setAttribute("style", "visibility: hidden");
    stopVideos()
};

hideHelpButton.addEventListener("click", function(){
    localStorage.setItem("showHelp", "false");
});

helpButton.addEventListener("click", function(){
    openHelpModal();
});

helpUnderlay.addEventListener("click", function(){
    closeHelpModal();
});

helpCloseButton.addEventListener("click", function(){
    closeHelpModal();
});

function stopVideos(){
    if(helpPlayer){
        helpPlayer.stopVideo();
    }
    if(sceneExportPlayer){
        sceneExportPlayer.stopVideo();
    }
    if(framesExportPlayer){
        framesExportPlayer.stopVideo();
    }
}