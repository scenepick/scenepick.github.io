var sendButton = document.getElementById("sendButton");
var consent = document.getElementById("consent");
consent.addEventListener("click", function(){
    if (consent.checked){
        sendButton.disabled = false;
    } else {
        sendButton.disabled = true;
    }
});