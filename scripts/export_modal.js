var exportModal = document.getElementById("exportModal");
var exportUnderlay = document.getElementById("exportUnderlay");
var exportCloseButton = document.getElementById("exportCloseButton");
var exportButton = document.getElementById("exportButton");

exportButton.addEventListener("click", function(){
    openModal();
})

exportUnderlay.addEventListener("click", function(){
    closeModal();
})

exportCloseButton.addEventListener("click", function(){
    closeModal();
})

function openModal(){
    exportModal.setAttribute("style", "visibility: visible");
    exportUnderlay.setAttribute("style", "visibility: visible");
}

function closeModal(){
    exportModal.setAttribute("style", "visibility: hidden");
    exportUnderlay.setAttribute("style", "visibility: hidden");
}