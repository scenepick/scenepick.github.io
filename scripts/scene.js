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
    var defaultLightX = jsonData.environment.light[0];
    var defaultLightY = jsonData.environment.light[1];
    var defaultShadowDarkness = jsonData.environment.shadowDarkness;
    
    // CONTROLS PANEL
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
        camera.lowerBetaLimit = 0;
        camera.lowerRadiusLimit = 0;
        camera.upperRadiusLimit = 200;
        camera.minZ = 0;

        // HIGHLIGHT LAYER
        var highlightLayer = new BABYLON.HighlightLayer("highlightLayer", scene);
        highlightLayer.outerGlow = false;

        // APPEND 3D MODEL & EXECUTE WHEN READY
        BABYLON.SceneLoader.Append("../scenes/", sceneName + ".gltf", scene, function () {
            scene.executeWhenReady(function () {

                // OBJECTS SETUP
                var visObjects = []
                var invisObjects = []
                for(var i = 0; i < jsonData.objects.length; i++){
                    if (jsonData.objects[i].isShadowOnly == false) {
                        visObjects.push(scene.getMeshByName(jsonData.objects[i].name))
                    }else{
                        invisObjects.push(scene.getMeshByName(jsonData.objects[i].name))
                    }
                };
                
                // VISIBLE OBJECTS MATERIAL
                for(var i = 0; i < visObjects.length; i++){
                    visObjects[i].material = new BABYLON.PBRMaterial(visObjects[i], scene);
                    visObjects[i].material.roughness = 1;
                    visObjects[i].material.clearCoat.isEnabled = true;
                    visObjects[i].material.clearCoat.roughness = 1;
                    visObjects[i].material.albedoColor = new BABYLON.Color3.FromHexString(jsonData.objects[i].color);
                    visObjects[i].material.emissiveIntensity = jsonData.objects[i].emissiveIntensity;
                    visObjects[i].material.alpha = jsonData.objects[i].alpha;
                };

                // INVISIBLE OBJECTS MATERIAL
                var invisMat = new BABYLON.ShadowOnlyMaterial("mat", scene);
                invisMat.alpha = 0.4;
                for(var i = 0; i < invisObjects.length; i++){
                    invisObjects[i].material = invisMat;
                };

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

                // MESH SELECTION & EDITING
                var objectColorPicker = new Huebee(document.getElementById("objectColorPicker"), {
                    notation: 'hex',
                    saturations: 3,
                });
                var objectEmissiveSlider = document.getElementById("objectEmissiveSlider")
                var objectAlphaSlider = document.getElementById("objectAlphaSlider");
                objectAlphaSlider.setAttribute("style", "direction: rtl");
                var selectedMesh;
                for(var i = 0; i < invisObjects.length; i++){
                    invisObjects[i].isPickable = false
                };
                scene.onPointerDown = function castRay(){
                    var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);
                    var hit = scene.pickWithRay(ray);
                    removeHighlight();
                    removeHuebee()
                    if (visObjects.includes(hit.pickedMesh)){               
                        highlightLayer.addMesh(hit.pickedMesh, BABYLON.Color3.FromHexString("#ffffff"));
                        selectedMesh = hit.pickedMesh;
                        objectColorPicker.setColor(selectedMesh.material.albedoColor.toHexString())
                        objectEmissiveSlider.value = selectedMesh.material.emissiveIntensity;
                        objectAlphaSlider.value = selectedMesh.material.alpha;
                        objectControls.setAttribute("style", "display: block");
                        environmentControls.setAttribute("style", "display: none");
                    }else{
                        objectControls.setAttribute("style", "display: none");
                        environmentControls.setAttribute("style", "display: block");
                    };
                };
                function removeHighlight(){
                    for(var i = 0; i < visObjects.length; i++){
                        highlightLayer.removeMesh(visObjects[i]);
                    };
                };
                objectColorPicker.on('change', function(color) {
                    selectedMesh.material.albedoColor = new BABYLON.Color3.FromHexString(color);
                    selectedMesh.material.emissiveColor = new BABYLON.Color3.FromHexString(color);
                });
                objectEmissiveSlider.addEventListener("input", function(){
                    selectedMesh.material.emissiveIntensity = objectEmissiveSlider.value;
                    selectedMesh.material.emissiveColor = new BABYLON.Color3.FromHexString(objectColorPicker.value);
                });
                objectAlphaSlider.addEventListener("input", function(){
                    selectedMesh.material.alpha = objectAlphaSlider.value;
                });
                function removeHuebee(){ // library bug fix - sometimes huebee did not dissappea
                    var huebeeElement = document.getElementsByClassName("huebee");
                    for(var i = 0; i < huebeeElement.length; i++){
                        huebeeElement[i].remove();
                    };
                };

                
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

                // LIGHTS SETUP
                var light1 = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(0, Math.PI, 0), scene);
                light1.position = new BABYLON.Vector3(0, 0, 0);
                light1.intensity = 3;
                light1.autoCalcShadowZBounds = true;
                var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 1, 0), scene);
                light2.intensity = 1;
                var light3 = new BABYLON.HemisphericLight("light3", new BABYLON.Vector3(0, -1, 0), scene);
                light3.intensity = 1;

                // LIGHT POSITION
                var lightPivot = new BABYLON.TransformNode("root"); 
                light1.parent = lightPivot;
                var lightXSlider = document.getElementById("lightXSlider");
                lightXSlider.value = defaultLightX;
                lightPivot.rotation.x = Math.PI * lightXSlider.value;
                lightXSlider.addEventListener("input", function(){
                    lightPivot.rotation.x = Math.PI * lightXSlider.value;
                });
                var lightYSlider = document.getElementById("lightYSlider");
                lightYSlider.value = defaultLightY;
                lightPivot.rotation.y = Math.PI * lightYSlider.value;
                lightYSlider.addEventListener("input", function(){
                    lightPivot.rotation.y = Math.PI * lightYSlider.value;
                });

                // SHADOW SETUP
                var shadowGenerator = new BABYLON.ShadowGenerator(2048, light1);
                for(var i = 0; i < visObjects.length; i++){
                    shadowGenerator.addShadowCaster(visObjects[i])
                };
                for(var i = 0; i < scene.meshes.length; i++){
                    scene.meshes[i].receiveShadows = true;
                };
                shadowGenerator.forceBackFacesOnly = true;
                shadowGenerator.transparencyShadow = true;
                shadowGenerator.darkness = defaultShadowDarkness;
                shadowGenerator.bias = 0.001

                // SHADOW DARKNESS
                var shadowDarknessSlider = document.getElementById("shadowDarknessSlider");
                shadowDarknessSlider.value = defaultShadowDarkness;
                shadowDarknessSlider.setAttribute("style", "direction: rtl");
                shadowDarknessSlider.addEventListener("input", function(){
                    shadowGenerator.darkness = shadowDarknessSlider.value;
                });

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
                    lightXSlider.value = defaultLightX;
                    lightPivot.rotation.x = Math.PI * lightXSlider.value;    
                    lightYSlider.value = defaultLightY;
                    lightPivot.rotation.y = Math.PI * lightYSlider.value;
                    shadowDarknessSlider.value = defaultShadowDarkness;
                    shadowGenerator.darkness = defaultShadowDarkness;
                    removeHighlight();
                    for(var i = 0; i < visObjects.length; i++){
                        visObjects[i].material.albedoColor = new BABYLON.Color3.FromHexString(jsonData.objects[i].color);
                        visObjects[i].material.emissiveIntensity = jsonData.objects[i].emissiveIntensity;
                        visObjects[i].material.alpha = jsonData.objects[i].alpha;
                    };
                    objectControls.setAttribute("style", "display: none");
                    environmentControls.setAttribute("style", "display: block");
                };

                // DOWNLOAD IMAGE
                var canvasContainer = document.querySelector(".canvasContainer");
                var downloadButton = document.getElementById("downloadButton");
                var transparentBackground = document.getElementById("transparentBackground");
                var sizeOne = document.getElementById("sizeOne");
                var sizeTwo = document.getElementById("sizeTwo");
                var sizeTree = document.getElementById("sizeTree");
                downloadButton.addEventListener("click", function(){
                    if (transparentBackground.checked){
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