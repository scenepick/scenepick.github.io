// READING LOCAL STORAGE
const sceneName = localStorage.getItem("sceneName");

// LOADING SCENE JSON
fetch("../scenes/" + sceneName + ".json") 
	.then(response => response.json()) 
	.then(jsonData => {

    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true,);
    engine.setHardwareScalingLevel(0.5);

    // KEEP CANVAS 1:1
    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth;

    // DISABLE WINDOW SCROLL WHEN MOUSE ON CANVAS
    canvas.onwheel = function(event){
        event.preventDefault();
    };
    canvas.onmousewheel = function(event){
        event.preventDefault();
    };

    // DEFAULT ENVIRONMENT VALUES
    var defaultCamPos = [jsonData.environment.cameraPosition[0], jsonData.environment.cameraPosition[1], jsonData.environment.cameraPosition[2]];
    var defaultCamTar = [jsonData.environment.cameraTarget[0],jsonData.environment.cameraTarget[1],jsonData.environment.cameraTarget[2]];
    var defaultBgColor = jsonData.environment.color;
    var defaultFov = jsonData.environment.fov;
    var defaultLightPosition = [jsonData.environment.lightPosition[0],jsonData.environment.lightPosition[1]];
    var defaultShadowTransparency = jsonData.environment.shadowTransparency;
    var defaultShadowPlanes = jsonData.environment.shadowPlanes;
    var defaultShadowPlaneX = [jsonData.environment.shadowPlaneX[0], jsonData.environment.shadowPlaneX[1]];
    var defaultShadowPlaneY = [jsonData.environment.shadowPlaneY[0], jsonData.environment.shadowPlaneY[1]];
    var defaultShadowPlaneZ = [jsonData.environment.shadowPlaneZ[0], jsonData.environment.shadowPlaneZ[1]];
    
    // CONTROLS PANELS
    var environmentControls = document.getElementById("environmentControls");
    var objectControls = document.getElementById("objectControls");
    objectControls.setAttribute("style", "display: none");

    // SCENE SETUP
    var createScene = function () {
        var scene = new BABYLON.Scene(engine)
        engine.resize();

        // CAMERA SETUP
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
        camera.setPosition(new BABYLON.Vector3(defaultCamPos[0], defaultCamPos[1], defaultCamPos[2]));
        camera.setTarget(new BABYLON.Vector3(defaultCamTar[0], defaultCamTar[1], defaultCamTar[2]));
        camera.attachControl(canvas, true);
        camera.wheelPrecision = 20;
        camera.pinchPrecision = 100;
        camera.lowerRadiusLimit = 0;
        camera.upperRadiusLimit = 200;
        camera.minZ = 0;
        camera.maxZ = 100;
        camera.lowerBetaLimit = null;
        camera.upperBetaLimit = null;
        camera.allowUpsideDown = true;

        // BACKGROUND COLOR
        scene.clearColor = new BABYLON.Color3.FromHexString(defaultBgColor);
        var environmentColorPicker = new Huebee(document.getElementById("environmentColorPicker"), {
            notation: 'hex',
            saturations: 3,
        });
        environmentColorPicker.setColor(defaultBgColor)
        environmentColorPicker.value = defaultBgColor;
        environmentColorPicker.on('change', function(color) {
            scene.clearColor = new BABYLON.Color3.FromHexString(color);
            environmentColorPicker.value = color;
        });

        // LIGHTS SETUP
        var light1 = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(0, Math.PI, 0), scene);
        light1.intensity = 3;
        var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 1, 0), scene);
        light2.intensity = 1;
        var light3 = new BABYLON.HemisphericLight("light3", new BABYLON.Vector3(0, -1, 0), scene);
        light3.intensity = 1;

        // LIGHT POSITION
        var lightPivot = new BABYLON.TransformNode("root"); 
        light1.parent = lightPivot;
        var lightPosOneSlider = document.getElementById("lightPosOneSlider");
        lightPosOneSlider.value = defaultLightPosition[0];
        lightPivot.rotation.x = Math.PI * lightPosOneSlider.value;
        lightPosOneSlider.addEventListener("input", function(){
            lightPivot.rotation.x = Math.PI * lightPosOneSlider.value;
        });
        var lightPosTwoSlider = document.getElementById("lightPosTwoSlider");
        lightPosTwoSlider.value = defaultLightPosition[1];
        lightPivot.rotation.y = Math.PI * lightPosTwoSlider.value;
        lightPosTwoSlider.addEventListener("input", function(){
            lightPivot.rotation.y = Math.PI * lightPosTwoSlider.value;
        });

        // SHADOW SETUP
        var shadowGenerator = new BABYLON.ShadowGenerator(2048, light1);
        shadowGenerator.usePercentageCloserFiltering = true;
        shadowGenerator.forceBackFacesOnly = true;
        shadowGenerator.transparencyShadow = true;
        shadowGenerator.enableSoftTransparentShadow = true;
        shadowGenerator.darkness = defaultShadowTransparency;

        // SHADOW TRANSPARENCY
        var shadowTransparencySlider = document.getElementById("shadowTransparencySlider");
        shadowTransparencySlider.value = defaultShadowTransparency;
        shadowTransparencySlider.addEventListener("input", function(){
            shadowGenerator.darkness = shadowTransparencySlider.value;
        });

        // FIELD OF VIEW
        var fovSlider = document.getElementById("fovSlider");
        fovSlider.value = defaultFov;
        fovSlider.addEventListener("input", function(){
            camera.fov = fovSlider.value;
            setPrecision(fovSlider.value);
        });
        function setPrecision(fov){
            if(fov > 0.6){
                camera.wheelPrecision = 35;
                camera.pinchPrecision = 175;
            }else if(fov < 1.1){
                camera.wheelPrecision = 5;
                camera.pinchPrecision = 25;
            }else{
                camera.wheelPrecision = 20
                camera.pinchPrecision = 100;
            }
        }

        // SHADOW PLANES
        var planeZ = BABYLON.MeshBuilder.CreateGround("planeZ", {height: 20, width: 20});
        var planeY = BABYLON.MeshBuilder.CreateGround("planeY", {height: 20, width: 20});
        planeY.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
        var planeX = BABYLON.MeshBuilder.CreateGround("planeX", {height: 20, width: 20});
        planeX.rotation = new BABYLON.Vector3(Math.PI/2, Math.PI/2, 0);
        var scenePlanes = [planeX, planeY, planeZ];
        var invisMat = new BABYLON.ShadowOnlyMaterial("mat", scene);
        invisMat.alpha = 0.4;
        for(var i = 0; i < scenePlanes.length; i++){
            scenePlanes[i].isPickable = false
            scenePlanes[i].material = invisMat;
            scenePlanes[i].material.backFaceCulling = false;
            scenePlanes[i].receiveShadows = true;
        };
        var shadowPlanesPanel = document.getElementById("shadowPlanesPanel");
        var shadowPlanesToggle = document.getElementById("shadowPlanesToggle");
        var planeRadioX = document.getElementById("planeRadioX");
        var planeRadioY = document.getElementById("planeRadioY");
        var planeRadioZ = document.getElementById("planeRadioZ");
        var shadowPlaneSlider = document.getElementById("shadowPlaneSlider");
        var isSelectedX
        var isSelectedY
        var isSelectedZ
        function shadowPlanesSetup(){
            var event = new Event("change");
            if(defaultShadowPlanes){
                shadowPlanesToggle.checked = true;
            }else{
                shadowPlanesToggle.checked = false;
            }
            shadowPlanesToggle.dispatchEvent(event);
            planeX.position.x = defaultShadowPlaneX[1];
            planeY.position.z = defaultShadowPlaneY[1];
            planeZ.position.y = defaultShadowPlaneZ[1];
            if(defaultShadowPlaneX[0]){
                planeRadioX.checked = true;
                planeRadioX.dispatchEvent(event);
            }
            if(defaultShadowPlaneY[0]){
                planeRadioY.checked = true;
                planeRadioY.dispatchEvent(event);
            }
            if(defaultShadowPlaneZ[0]){
                planeRadioZ.checked = true;
                planeRadioZ.dispatchEvent(event);
            }
        }
        shadowPlanesToggle.addEventListener("change", function(){
            var event = new Event("change");
            if(shadowPlanesToggle.checked){
                planeRadioX.dispatchEvent(event);
                planeRadioY.dispatchEvent(event);
                planeRadioZ.dispatchEvent(event);
                shadowPlanesPanel.setAttribute("style", "display: block");
            }else{
                planeX.isVisible = false;
                planeY.isVisible = false;
                planeZ.isVisible = false;
                shadowPlanesPanel.setAttribute("style", "display: none");
            }
        });
        planeRadioX.addEventListener("change", function(){
            if(planeRadioX.checked){
                shadowPlaneSlider.value = planeX.position.x;
                planeX.isVisible = true;
                planeY.isVisible = false;
                planeZ.isVisible = false;
                isSelectedX = true;
                isSelectedY = false;
                isSelectedZ = false;
            }
        });
        planeRadioY.addEventListener("change", function(){
            if(planeRadioY.checked){
                shadowPlaneSlider.value = planeY.position.z;
                planeX.isVisible = false;
                planeY.isVisible = true;
                planeZ.isVisible = false;
                isSelectedX = false;
                isSelectedY = true;
                isSelectedZ = false;
            }
        });
        planeRadioZ.addEventListener("change", function(){
            if(planeRadioZ.checked){
                shadowPlaneSlider.value = planeZ.position.y;
                planeX.isVisible = false;
                planeY.isVisible = false;
                planeZ.isVisible = true;
                isSelectedX = false;
                isSelectedY = false;
                isSelectedZ = true;
            }
        });
        shadowPlaneSlider.addEventListener("input", function(){
            if(isSelectedX){
                planeX.position.x = shadowPlaneSlider.value;
                planeX.showBoundingBox = true;
            }
            if(isSelectedY){
                planeY.position.z = shadowPlaneSlider.value;
                planeY.showBoundingBox = true;
            }
            if(isSelectedZ){
                planeZ.position.y = shadowPlaneSlider.value;
                planeZ.showBoundingBox = true;
            }
        });

        shadowPlaneSlider.addEventListener('focusout', hidePlaneBoundingBox);
        shadowPlaneSlider.addEventListener('pointerup', hidePlaneBoundingBox);
        shadowPlaneSlider.addEventListener('touchend', hidePlaneBoundingBox);
        function hidePlaneBoundingBox() {
            planeX.showBoundingBox = false;
            planeY.showBoundingBox = false;
            planeZ.showBoundingBox = false;
        }
        shadowPlanesSetup()

        // APPEND 3D MODEL & EXECUTE WHEN READY
        BABYLON.SceneLoader.Append("../scenes/", sceneName + ".gltf", scene, function () {
            scene.executeWhenReady(function () {

                // OBJECTS SETUP
                var sceneObjects = []
                for(var i = 0; i < jsonData.objects.length; i++){
                    sceneObjects.push(scene.getMeshByName(jsonData.objects[i].name))                    
                };
                for(var i = 0; i < sceneObjects.length; i++){
                    shadowGenerator.addShadowCaster(sceneObjects[i])
                    sceneObjects[i].receiveShadows = true;
                    sceneObjects[i].material = new BABYLON.PBRMaterial(sceneObjects[i], scene);
                    sceneObjects[i].material.roughness = 1;
                    sceneObjects[i].material.clearCoat.isEnabled = true;
                    sceneObjects[i].material.clearCoat.roughness = 1;
                };
                function objectPropertiesSetup(){
                    for(var i = 0; i < sceneObjects.length; i++){
                        sceneObjects[i].material.albedoColor = new BABYLON.Color3.FromHexString(jsonData.objects[i].color);
                        sceneObjects[i].material.emissiveIntensity = jsonData.objects[i].emissiveIntensity;
                        sceneObjects[i].material.emissiveColor = new BABYLON.Color3.FromHexString(jsonData.objects[i].color)
                        sceneObjects[i].visibility = jsonData.objects[i].visibility;
                        sceneObjects[i].material.wireframe = jsonData.objects[i].wireframe;
                        if(jsonData.objects[i].wireframe){
                            sceneObjects[i].material.clearCoat.isEnabled = false;
                        }else{
                            sceneObjects[i].material.clearCoat.isEnabled = true;
                        };
                    };
                };
                objectPropertiesSetup()

                // MESH SELECTION & EDITING
                var objectColorPicker = new Huebee(document.getElementById("objectColorPicker"), {
                    notation: 'hex',
                    saturations: 3,
                });
                var objectEmissiveSlider = document.getElementById("objectEmissiveSlider")
                var objectVisibilitySlider = document.getElementById("objectVisibilitySlider");
                objectVisibilitySlider.setAttribute("style", "direction: rtl");
                var objectWireframeToggle = document.getElementById("objectWireframeToggle");
                var selectedMesh;
                scene.onPointerDown = function castRay(){
                    var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);
                    var hit = scene.pickWithRay(ray);
                    removeHighlight();
                    removeHuebee()
                    if(sceneObjects.includes(hit.pickedMesh)){               
                        hit.pickedMesh.showBoundingBox = true;
                        selectedMesh = hit.pickedMesh;
                        objectColorPicker.setColor(selectedMesh.material.albedoColor.toHexString())
                        objectEmissiveSlider.value = selectedMesh.material.emissiveIntensity;
                        objectVisibilitySlider.value = selectedMesh.visibility;
                        objectWireframeToggle.checked = selectedMesh.material.wireframe;
                        objectControls.setAttribute("style", "display: block");
                        environmentControls.setAttribute("style", "display: none");
                    }else{
                        objectControls.setAttribute("style", "display: none");
                        environmentControls.setAttribute("style", "display: block");
                    };
                };
                function removeHighlight(){
                    for(var i = 0; i < sceneObjects.length; i++){
                        sceneObjects[i].showBoundingBox = false;
                    };
                };
                objectColorPicker.on('change', function(color) {
                    selectedMesh.material.albedoColor = new BABYLON.Color3.FromHexString(color);
                    selectedMesh.material.emissiveColor = new BABYLON.Color3.FromHexString(color);
                });
                objectEmissiveSlider.addEventListener("input", function(){
                    selectedMesh.material.emissiveIntensity = objectEmissiveSlider.value;
                    selectedMesh.material.emissiveColor = new BABYLON.Color3.FromHexString(selectedMesh.material.albedoColor.toHexString());
                });
                objectVisibilitySlider.addEventListener("input", function(){
                    selectedMesh.visibility = objectVisibilitySlider.value;
                });
                objectWireframeToggle.addEventListener("change", function(){
                    if(objectWireframeToggle.checked){
                        selectedMesh.material.wireframe = true;
                        selectedMesh.material.clearCoat.isEnabled = false;
                        
                    }else{
                        selectedMesh.material.wireframe = false;
                        selectedMesh.material.clearCoat.isEnabled = true;
                    }
                });
                function removeHuebee(){ // library bug fix - sometimes huebee did not dissappea
                    var huebeeElement = document.getElementsByClassName("huebee");
                    for(var i = 0; i < huebeeElement.length; i++){
                        huebeeElement[i].remove();
                    };
                };

                // DEFAULT BUTTON
                var resetButton = document.getElementById("resetButton");
                resetButton.addEventListener("click", function(){
                    resetToDefault();
                });
                function resetToDefault(){
                    camera.setPosition(new BABYLON.Vector3(defaultCamPos[0], defaultCamPos[1], defaultCamPos[2]));
                    camera.setTarget(new BABYLON.Vector3(defaultCamTar[0], defaultCamTar[1], defaultCamTar[2]));
                    environmentColorPicker.setColor(defaultBgColor)
                    environmentColorPicker.value = defaultBgColor;
                    fovSlider.value = defaultFov;
                    camera.fov = defaultFov;
                    setPrecision(defaultFov);
                    lightPosOneSlider.value = defaultLightPosition[0];
                    lightPivot.rotation.x = Math.PI * lightPosOneSlider.value;
                    lightPosTwoSlider.value = defaultLightPosition[1];
                    lightPivot.rotation.y = Math.PI * lightPosTwoSlider.value;
                    shadowTransparencySlider.value = defaultShadowTransparency;
                    shadowGenerator.darkness = defaultShadowTransparency;
                    shadowPlanesSetup();
                    removeHighlight();
                    objectPropertiesSetup();
                    objectControls.setAttribute("style", "display: none");
                    environmentControls.setAttribute("style", "display: block");
                };

                // DOWNLOAD IMAGE
                var canvasContainer = document.querySelector(".canvasContainer");
                var downloadButton = document.getElementById("downloadButton");
                var transparentBackground = document.getElementById("transparentBackground");
                var sizeOne = document.getElementById("sizeRadioOne");
                var sizeTwo = document.getElementById("sizeRadioTwo");
                var sizeTree = document.getElementById("sizeRadioTree");
                downloadButton.addEventListener("click", function(){
                    removeHighlight();
                    objectControls.setAttribute("style", "display: none");
                    environmentControls.setAttribute("style", "display: block");
                    if(transparentBackground.checked){
                        scene.clearColor = new BABYLON.Color4(0,0,0,0);
                    }
                    canvasContainer.classList.add("resize");
                    engine.resize();
                    var imageSize;
                    if(sizeOne.checked){
                        imageSize = 0.5;
                    }
                    if(sizeTwo.checked){
                        imageSize = 1;
                    }
                    if(sizeTree.checked){
                        imageSize = 1.5;
                    }
                    BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, {precision: imageSize}, undefined, undefined, undefined, undefined, sceneName);
                    canvasContainer.classList.remove("resize");
                    engine.resize();
                    scene.clearColor = new BABYLON.Color3.FromHexString(environmentColorPicker.value);
                });
                
                // LOG SCENE VALUES SPACE PRESS
                document.addEventListener('keyup', event => {
                    if (event.code === 'Space') { 
                        console.log(camera.position.x + ", " + camera.position.y + ", " + camera.position.z)
                        console.log(camera.target.x + ", " + camera.target.y + ", " + camera.target.z)
                        console.log(scene.clearColor.toHexString())
                        console.log(lightPosOneSlider.value + ", " + lightPosTwoSlider.value)
                        console.log(shadowTransparencySlider.value)
                        console.log(fovSlider.value)
                        console.log(shadowPlanesToggle.checked)
                        console.log(planeRadioX.checked)
                        console.log(planeRadioY.checked)
                        console.log(planeRadioZ.checked)
                        console.log(shadowPlaneSlider.value)
                        for(var i = 0; i < sceneObjects.length; i++){
                            console.log(sceneObjects[i].id)
                            console.log(sceneObjects[i].material.albedoColor.toHexString())
                            console.log(sceneObjects[i].material.emissiveIntensity)
                            console.log(sceneObjects[i].visibility)
                            console.log(sceneObjects[i].material.wireframe)
                        };
                    }
                });
            });
        });
        return scene;
    };

    // CREATE SCENE
    var scene = createScene(); 
    engine.runRenderLoop(function () {
        scene.render();
    });

    // WATCH FOR BROWSER / CANVAS RESIZE EVENTS
    window.addEventListener("resize", function () {
        engine.resize();
    });
}); 

// ADVANCED CONTROLS PANEL
var advancedControlsButton = document.getElementById("advancedControlsButton")
var advancedConontolsPanel = document.getElementById("advancedConontolsPanel")
advancedConontolsPanel.setAttribute("style", "display: none");
var isHiddenAdvancedControls = true
advancedControlsButton.addEventListener("click", function(){
    advancedControlsButton.classList.toggle("collapse");
    if(isHiddenAdvancedControls){
        advancedConontolsPanel.setAttribute("style", "display: block");
        isHiddenAdvancedControls = false
    }else{
        advancedConontolsPanel.setAttribute("style", "display: none");
        isHiddenAdvancedControls = true
    }
});
