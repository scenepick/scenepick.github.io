// SETTING LOCAL STORAGE TO THE DATA ATTRIBUTE OT THE CLICKED LINK 
localStorage.removeItem("sceneName");
var scenesList = document.getElementById("scenesList");
scenesList.addEventListener("click", setLocalStorage, false);
function setLocalStorage(event){
    localStorage.setItem("sceneName", event.target.dataset.scenename);
}