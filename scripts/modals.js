// Export Modal
var exportModal = document.getElementById("exportModal");
var exportUnderlay = document.getElementById("exportUnderlay");
var exportCloseButton = document.getElementById("exportCloseButton");
var exportButton = document.getElementById("exportButton");

closeExportModal()

exportButton.addEventListener("click", function(){
    openExportModal();
})

exportUnderlay.addEventListener("click", function(){
    closeExportModal();
})

exportCloseButton.addEventListener("click", function(){
    closeExportModal();
})

function openExportModal(){
    exportModal.setAttribute("style", "visibility: visible");
    exportUnderlay.setAttribute("style", "visibility: visible");
}

function closeExportModal(){
    exportModal.setAttribute("style", "visibility: hidden");
    exportUnderlay.setAttribute("style", "visibility: hidden");
}

// Help Modal
var helpModal = document.getElementById("helpModal");
var helpUnderlay = document.getElementById("helpUnderlay");
var helpCloseButton = document.getElementById("helpCloseButton");
var helpButton = document.getElementById("helpButton");
var hideHelpButton = document.getElementById("hideHelpButton");
var helpVideo = document.getElementById("helpVideo");
console.log(helpVideo)

closeHelpModal()

const showHelp = localStorage.getItem("showHelp");

if(showHelp == "false"){
    closeHelpModal();
    hideHelpButton.setAttribute("style", "display: none");
}else if(showHelp == "true"){
    openHelpModal();
}else{
    openHelpModal();
    localStorage.setItem("showHelp", "true");
}

function openHelpModal(){
    helpModal.setAttribute("style", "visibility: visible");
    helpUnderlay.setAttribute("style", "visibility: visible");
}

function closeHelpModal(){
    helpModal.setAttribute("style", "visibility: hidden");
    helpUnderlay.setAttribute("style", "visibility: hidden");
}

// global variable for the player
var player;

// this function gets called when API is ready to use
function onYouTubePlayerAPIReady() {
    // create the global player from the specific iframe (#video)
    player = new YT.Player("helpVideo", {
        events: {
            // call this function when player is ready to use
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {

    hideHelpButton.addEventListener("click", function(){
        closeHelpModal()
        player.stopVideo();
        localStorage.setItem("showHelp", "false");
    })
    
    helpButton.addEventListener("click", function(){
        openHelpModal();
    })
    
    helpUnderlay.addEventListener("click", function(){
        closeHelpModal();
        player.stopVideo();
    })
    
    helpCloseButton.addEventListener("click", function(){
        closeHelpModal();
        player.stopVideo();
    })
}

// Inject YouTube API script
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);