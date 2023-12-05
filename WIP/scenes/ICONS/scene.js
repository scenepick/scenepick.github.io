// READING AND VALIDATING LOCAL STORAGE 
const collectionName = "ICONS"
const sceneName = localStorage.getItem("sceneName");
if(sceneName == null){
    window.location.href = "https://scenepick.com";
}

const sceneContent = document.getElementById("sceneContent");
const generatingFrames = document.getElementById("generatingFrames");
generatingFrames.setAttribute("style", "display: none");
const framesProgress = document.getElementById("framesProgress");
const downloadFramesError = document.getElementById("downloadFramesError");

const renderCanvasContainer = document.getElementById("renderCanvasContainer");
const renderCanvas = document.getElementById("renderCanvas");
renderCanvas.style.opacity = 0;
renderCanvas.style.transition = "2.5s";
renderCanvas.width = window.innerWidth;
renderCanvas.height = window.innerWidth;
renderCanvas.requestPointerLock = renderCanvas.requestPointerLock || renderCanvas.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
renderCanvas.onpointerdown = function(event) {
    if(event.pointerType === "mouse") {
        renderCanvas.requestPointerLock();
    };
};
renderCanvas.onpointerup = function(event) {
    if(event.pointerType === "mouse") {
        document.exitPointerLock();
    };
};

const colorPickerSettings = {
    customColors: ["#FF8A80", "#FF5252", "#FF1744", "#D50000", "#FFEBEE", "#FFCDD2", "#EF9A9A", "#E57373", "#EF5350", "#F44336", "#E53935", "#D32F2F", "#C62828", "#B71C1C", "#FF80AB", "#FF4081", "#F50057", "#C51162", "#FCE4EC", "#F8BBD0", "#F48FB1", "#F06292", "#EC407A", "#E91E63", "#D81B60", "#C2185B", "#AD1457", "#880E4F", "#EA80FC", "#E040FB", "#D500F9", "#AA00FF", "#F3E5F5", "#E1BEE7", "#CE93D8", "#BA68C8", "#AB47BC", "#9C27B0", "#8E24AA", "#7B1FA2", "#6A1B9A", "#4A148C", "#B388FF", "#7C4DFF", "#651FFF", "#6200EA", "#EDE7F6", "#D1C4E9", "#B39DDB", "#9575CD", "#7E57C2", "#673AB7", "#5E35B1", "#512DA8", "#4527A0", "#311B92", "#8C9EFF", "#536DFE", "#3D5AFE", "#304FFE", "#E8EAF6", "#C5CAE9", "#9FA8DA", "#7986CB", "#5C6BC0", "#3F51B5", "#3949AB", "#303F9F", "#283593", "#1A237E", "#82B1FF", "#448AFF", "#2979FF", "#2962FF", "#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2", "#1565C0", "#0D47A1", "#80D8FF", "#40C4FF", "#00B0FF", "#0091EA", "#E1F5FE", "#B3E5FC", "#81D4FA", "#4FC3F7", "#29B6F6", "#03A9F4", "#039BE5", "#0288D1", "#0277BD", "#01579B", "#84FFFF", "#18FFFF", "#00E5FF", "#00B8D4", "#E0F7FA", "#B2EBF2", "#80DEEA", "#4DD0E1", "#26C6DA", "#00BCD4", "#00ACC1", "#0097A7", "#00838F", "#006064", "#A7FFEB", "#64FFDA", "#1DE9B6", "#00BFA5", "#E0F2F1", "#B2DFDB", "#80CBC4", "#4DB6AC", "#26A69A", "#009688", "#00897B", "#00796B", "#00695C", "#004D40", "#B9F6CA", "#69F0AE", "#00E676", "#00C853", "#E8F5E9", "#C8E6C9", "#A5D6A7", "#81C784", "#66BB6A", "#4CAF50", "#43A047", "#388E3C", "#2E7D32", "#1B5E20", "#CCFF90", "#B2FF59", "#76FF03", "#64DD17", "#F1F8E9", "#DCEDC8", "#C5E1A5", "#AED581", "#9CCC65", "#8BC34A", "#7CB342", "#689F38", "#558B2F", "#33691E", "#F4FF81", "#EEFF41", "#C6FF00", "#AEEA00", "#F9FBE7", "#F0F4C3", "#E6EE9C", "#DCE775", "#D4E157", "#CDDC39", "#C0CA33", "#AFB42B", "#9E9D24", "#827717", "#FFFF8D", "#FFFF00", "#FFEA00", "#FFD600", "#FFFDE7", "#FFF9C4", "#FFF59D", "#FFF176", "#FFEE58", "#FFEB3B", "#FDD835", "#FBC02D", "#F9A825", "#F57F17", "#FFE57F", "#FFD740", "#FFC400", "#FFAB00", "#FFF8E1", "#FFECB3", "#FFE082", "#FFD54F", "#FFCA28", "#FFC107", "#FFB300", "#FFA000", "#FF8F00", "#FF6F00", "#FFD180", "#FFAB40", "#FF9100", "#FF6D00", "#FFF3E0", "#FFE0B2", "#FFCC80", "#FFB74D", "#FFA726", "#FF9800", "#FB8C00", "#F57C00", "#EF6C00", "#E65100", "#FF9E80", "#FF6E40", "#FF3D00", "#DD2C00", "#FBE9E7", "#FFCCBC", "#FFAB91", "#FF8A65", "#FF7043", "#FF5722", "#F4511E", "#E64A19", "#D84315", "#BF360C", "#EFEBE9", "#EFEBE9", "#EFEBE9", "#EFEBE9", "#EFEBE9", "#D7CCC8", "#BCAAA4", "#A1887F", "#8D6E63", "#795548", "#6D4C41", "#5D4037", "#4E342E", "#3E2723", "#FAFAFA", "#FAFAFA", "#FAFAFA", "#FAFAFA", "#FAFAFA", "#F5F5F5", "#EEEEEE", "#E0E0E0", "#BDBDBD", "#9E9E9E", "#757575", "#616161", "#424242", "#212121", "#ECEFF1", "#ECEFF1", "#ECEFF1", "#ECEFF1", "#ECEFF1", "#CFD8DC", "#B0BEC5", "#90A4AE", "#78909C", "#607D8B", "#546E7A", "#455A64", "#37474F", "#263238"],
    notation: 'hex',
    hues: 14,
    shades: 0,
};

// LOADING SCENE JSON
fetch("../../scenes/" + collectionName + "/" + sceneName + "/settings.json") 
	.then(response => response.json()) 
	.then(jsonData => {

    // EXTRACTING DEFAULT SETTINGS VALUES

    if(jsonData.material1Color){
        var material1Color = jsonData.material1Color
    }
    if(jsonData.material2Color){
        var material2Color = jsonData.material2Color
    }
    if(jsonData.material3Color){
        var material3Color = jsonData.material3Color
    }
    if(jsonData.material4Color){
        var material4Color = jsonData.material4Color
    }
    var materialRoughness = jsonData.materialRoughness;
    var backgroundColorEnabled = jsonData.backgroundColorEnabled;
    var backgroundColor = jsonData.backgroundColor;
    var defaultCameraPitch = jsonData.defaultCameraPitch;
    var defaultCameraYaw = jsonData.defaultCameraYaw;
    var interactiveCameraEnabled = jsonData.interactiveCameraEnabled;
    var cameraSnapBackEnabled = jsonData.cameraSnapBackEnabled;
    var horizontalSpinEnabled = jsonData.horizontalSpinEnabled;
    var spinClockwiseEnabled = jsonData.spinClockwiseEnabled;
    var verticalOscillationEnabled = jsonData.verticalOscillationEnabled;

    // STARTING THE ENGINE AND CHECKING FOR WEBGL SUPPORT
    var engine = new BABYLON.Engine(renderCanvas, true,);
    if(engine.webGLVersion < 2){
        window.location.href = "https://scenepick.com/pages/error.html";
    };

    BABYLON.SceneLoader.ShowLoadingScreen = false ; // Removes the default loading screen

    const createScene = function () {
        const scene = new BABYLON.Scene(engine);
        scene.environmentTexture = new BABYLON.CubeTexture("../../scenes/" + collectionName + "/environment.env");
        scene.environmentIntensity = 3;
        scene.useRightHandedSystem = true;
        
        // CAMERA
        var cameraRadius = 15;
        var cameraSnapBackSpeed = 120;
        const camera = new BABYLON.ArcRotateCamera("Camera", BABYLON.Tools.ToRadians(defaultCameraPitch), BABYLON.Tools.ToRadians(defaultCameraYaw), cameraRadius, new BABYLON.Vector3(0, 0, 0), scene);
        camera.panningSensibility = 0;
        camera.lowerRadiusLimit = cameraRadius;
        camera.upperRadiusLimit = cameraRadius;
        camera.spinTo = function (whichprop, targetval, speed) {
            const easingFunction = new BABYLON.CubicEase();
            easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
            BABYLON.Animation.CreateAndStartAnimation('CameraSnapBack', this, whichprop, speed, 120, this[whichprop], targetval, 0, easingFunction);
        };

        var defaultCameraPitchSlider = document.getElementById("defaultCameraPitchSlider");
        var defaultCameraYawSlider = document.getElementById("defaultCameraYawSlider");

        var interactiveCameraEnabledToggle = document.getElementById("interactiveCameraEnabledToggle");
        var cameraSnapBackEnabledToggleContainer = document.getElementById("cameraSnapBackEnabledToggleContainer");
        var cameraSnapBackEnabledToggle = document.getElementById("cameraSnapBackEnabledToggle");

        setDefaultCamaraYaw(defaultCameraYaw);
        setDefaultCamaraPitch(defaultCameraPitch);
        setInteractiveCameraEnabled(interactiveCameraEnabled);
        setCameraSnapBackEnabled(cameraSnapBackEnabled);

        defaultCameraYawSlider.addEventListener("input", function(){
            setDefaultCamaraYaw(defaultCameraYawSlider.value);
        });

        defaultCameraPitchSlider.addEventListener("input", function(){
            setDefaultCamaraPitch(defaultCameraPitchSlider.value);
        });
        
        interactiveCameraEnabledToggle.addEventListener("change", function() {
            setInteractiveCameraEnabled(interactiveCameraEnabledToggle.checked);
        });

        cameraSnapBackEnabledToggle.addEventListener("change", function() {
            setCameraSnapBackEnabled(cameraSnapBackEnabledToggle.checked);
        });

        function setDefaultCamaraYaw(value){
            defaultCameraYawSlider.value = value;
            defaultCameraYaw = parseInt(value)
            cameraOrientationReset()
        };

        function setDefaultCamaraPitch(value){
            defaultCameraPitchSlider.value = value;
            defaultCameraPitch = parseInt(value)
            cameraOrientationReset()
        };

        function setInteractiveCameraEnabled(state) {
            interactiveCameraEnabledToggle.checked = state;
            interactiveCameraEnabled = state;
            cameraOrientationReset()
            if(state) {
                renderCanvasContainer.setAttribute("style", "pointer-events:revert")
                camera.attachControl(renderCanvas, true);
                cameraSnapBackEnabledToggleContainer.setAttribute("style", "display: block");
            }else {
                renderCanvasContainer.setAttribute("style", "pointer-events:none")
                camera.detachControl(renderCanvas, true);
                cameraSnapBackEnabledToggleContainer.setAttribute("style", "display: none");
            };
        };

        function setCameraSnapBackEnabled(state) {
            cameraSnapBackEnabledToggle.checked = state;
            cameraSnapBackEnabled = state;
            cameraOrientationReset()
        };

        renderCanvas.addEventListener("pointerup", function() {
            if (cameraSnapBackEnabled) {
                cameraOrientationReset()
            };
        });

        function cameraOrientationReset(){
            camera.spinTo("alpha", BABYLON.Tools.ToRadians(defaultCameraYaw), cameraSnapBackSpeed);
            camera.spinTo("beta", BABYLON.Tools.ToRadians(defaultCameraPitch), cameraSnapBackSpeed);
        }

        // BACKGROUND
        var backgroundColorPickerContainer = document.getElementById("backgroundColorPickerContainer");
        var backgroundColorPicker = new Huebee(document.getElementById("backgroundColorPicker"), colorPickerSettings);
        var backgroundColorEnabledToggle = document.getElementById("backgroundColorEnabledToggle");

        setBackgroundColor(backgroundColor)
        setBackgroundColorEnabled(backgroundColorEnabled);

        backgroundColorPicker.on('change', function(color) {
            setBackgroundColor(color);
        });
        backgroundColorEnabledToggle.addEventListener("change", function() {
            setBackgroundColorEnabled(backgroundColorEnabledToggle.checked);
        });

        function setBackgroundColor(color){
            scene.clearColor = new BABYLON.Color3.FromHexString(color);
            backgroundColorPicker.setColor(color)
            backgroundColorPicker.value = color;
            backgroundColor = color;
        };

        function setBackgroundColorEnabled(state) {
            backgroundColorEnabledToggle.checked = state;
            backgroundColorEnabled = state;
            if(state){
                setBackgroundColor(backgroundColorPicker.value);
                backgroundColorPickerContainer.setAttribute("style", "display: block");
            }else{
                scene.clearColor = new BABYLON.Color4(0,0,0,0);
                backgroundColorPickerContainer.setAttribute("style", "display: none");
            };
        };

        // LOADING MODEL
        BABYLON.SceneLoader.Append("../../", "scenes/" + collectionName + "/" + sceneName + "/model.glb", scene, function (scene) {
            scene.executeWhenReady( ()=> {
                renderCanvas.style.opacity = "1";
            });

            // MATERIALS
            var materials = []

            var material1ColorPickerContainer = document.getElementById("material1ColorPickerContainer");
            if(material1Color){
                var material1 = scene.getMaterialById("material1");
                materials.push(material1);
                var material1ColorPicker = new Huebee(document.getElementById("material1ColorPicker"), colorPickerSettings);
                setMaterial(material1, material1Color, material1ColorPicker);
                material1ColorPicker.on('change', function(color) {
                    setMaterial(material1, color, material1ColorPicker);
                    material1Color = color;
                });
            }else {
                material1ColorPickerContainer.setAttribute("style", "display: none");
            };

            var material2ColorPickerContainer = document.getElementById("material2ColorPickerContainer");
            if(material2Color){
                var material2 = scene.getMaterialById("material2");
                materials.push(material2);
                var material2ColorPicker = new Huebee(document.getElementById("material2ColorPicker"), colorPickerSettings);
                setMaterial(material2, material2Color, material2ColorPicker);
                material2ColorPicker.on('change', function(color) {
                    setMaterial(material2, color, material2ColorPicker);
                    material2Color = color;
                });
            }else {
                material2ColorPickerContainer.setAttribute("style", "display: none");
            };

            var material3ColorPickerContainer = document.getElementById("material3ColorPickerContainer");
            if(material3Color){
                var material3 = scene.getMaterialById("material3");
                materials.push(material3);
                var material3ColorPicker = new Huebee(document.getElementById("material3ColorPicker"), colorPickerSettings);
                setMaterial(material3, material3Color, material3ColorPicker);
                material3ColorPicker.on('change', function(color) {
                    setMaterial(material3, color, material3ColorPicker);
                    material3Color = color;
                });
            }else {
                material3ColorPickerContainer.setAttribute("style", "display: none");
            };

            var material4ColorPickerContainer = document.getElementById("material4ColorPickerContainer");
            if(material4Color){
                var material4 = scene.getMaterialById("material4");
                materials.push(material4);
                var material4ColorPicker = new Huebee(document.getElementById("material4ColorPicker"), colorPickerSettings);
                setMaterial(material4, material4Color, material4ColorPicker);
                material4ColorPicker.on('change', function(color) {
                    setMaterial(material4, color, material4ColorPicker);
                    material4Color = color;
                });
            }else {
                material4ColorPickerContainer.setAttribute("style", "display: none");
            };



            for(var i = 0; i < materials.length; i++) {
                materials[i].roughness = 1;
                materials[i].clearCoat.isEnabled = true;
                materials[i].clearCoat.isTintEnabled = true;
                materials[i].albedoTexture = new BABYLON.Texture("../../scenes/" + collectionName + "/" + sceneName + "/occlusion.png", scene, true, false);
            };

            var materialRoughnessSlider = document.getElementById("materialRoughnessSlider");
            materialRoughnessSlider.addEventListener("input", function(){
                setMaterialRoughness(materialRoughnessSlider.value);
            });
    
            setMaterialRoughness(materialRoughness)
        
            function setMaterialRoughness(value){
                materialRoughnessSlider.value = value;
                materialRoughness = parseFloat(value)
                for(var i = 0; i < materials.length; i++) {
                    materials[i].clearCoat.roughness = value;
                };
            };

            function setMaterial(material, color, picker) {
                material.albedoColor = new BABYLON.Color3.FromHexString(color);
                material.clearCoat.tintColor = new BABYLON.Color3.FromHexString(color);
                picker.setColor(color)
                picker.value = color;
            };
            
             // SPINING & OSCILLATION
            const centerNode = new BABYLON.TransformNode("root");
            const meshes = scene.meshes;

            for(var i = 0; i < meshes.length; i++) {
                meshes[i].parent = centerNode
            };

            // SPIN ANIM
            var horizontalSpinSpeed = 30;
            var spinAnim = new BABYLON.Animation("spinAnim", "rotation", horizontalSpinSpeed, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            var spinKeys = [];
            spinKeys.push({ frame: 0, value: new BABYLON.Vector3(0, BABYLON.Tools.ToRadians(0), 0) });
            spinKeys.push({ frame: 360, value: new BABYLON.Vector3(0, BABYLON.Tools.ToRadians(360), 0) });
            spinAnim.setKeys(spinKeys);
            var spinAnimGroup = new BABYLON.AnimationGroup("spinAnimGroup");
            spinAnimGroup.addTargetedAnimation(spinAnim, centerNode);

            // OSCILLATE ANIM
            var verticalOscillationSpeed = 30;
            var oscillateAnim = new BABYLON.Animation("oscillateAnim", "position", verticalOscillationSpeed, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            var oscillateKeys = [];
            oscillateKeys.push({ frame: 0, value: new BABYLON.Vector3(0, 0.25, 0) });
            oscillateKeys.push({ frame: 30, value: new BABYLON.Vector3(0, -0.25, 0) });
            oscillateKeys.push({ frame: 60, value: new BABYLON.Vector3(0, 0.25, 0) });
            oscillateAnim.setKeys(oscillateKeys);
            var oscillateEasing = new BABYLON.SineEase();
            oscillateEasing.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
            oscillateAnim.setEasingFunction(oscillateEasing);
            var oscillateAnimGroup = new BABYLON.AnimationGroup("oscillateAnimGroup");
            oscillateAnimGroup.addTargetedAnimation(oscillateAnim, centerNode);
            
            // ANIM TOGGLES
            var horizontalSpinEnabledToggle = document.getElementById("horizontalSpinEnabledToggle");
            horizontalSpinEnabledToggle.addEventListener("change", function() {
                setHorizontalSpinEnabled(horizontalSpinEnabledToggle.checked);
            });
            
            var spinClockwiseEnabledToggleContainer = document.getElementById("spinClockwiseEnabledToggleContainer");
            var spinClockwiseEnabledToggle = document.getElementById("spinClockwiseEnabledToggle");
            spinClockwiseEnabledToggle.addEventListener("change", function() {
                setSpinClockwiseEnabled(spinClockwiseEnabledToggle.checked);
            });

            var verticalOscillationEnabledToggle = document.getElementById("verticalOscillationEnabledToggle");
            verticalOscillationEnabledToggle.addEventListener("change", function() {
                setVerticalOscillationEnabled(verticalOscillationEnabledToggle.checked);
            });

            function setHorizontalSpinEnabled(state) {
                horizontalSpinEnabled = state;
                horizontalSpinEnabledToggle.checked = state;
                if(state) {
                    spinAnimGroup.play(true);
                    spinClockwiseEnabledToggleContainer.setAttribute("style", "display: block");
                }else {
                    spinAnimGroup.reset();
                    spinAnimGroup.stop();
                    spinClockwiseEnabledToggleContainer.setAttribute("style", "display: none");
                };
            };

            function setSpinClockwiseEnabled(state) {
                spinClockwiseEnabled = state;
                spinClockwiseEnabledToggle.checked = state;
                if(state) {
                    spinAnim.framePerSecond = horizontalSpinSpeed;
                }else {
                    spinAnim.framePerSecond = -horizontalSpinSpeed;
                };
            };

            function setVerticalOscillationEnabled(state) {
                verticalOscillationEnabled = state;
                verticalOscillationEnabledToggle.checked = state;
                if(state) {
                    oscillateAnimGroup.play(true);
                }else {
                    oscillateAnimGroup.reset();
                    oscillateAnimGroup.stop();
                };
            };
            
            setHorizontalSpinEnabled(horizontalSpinEnabled);
            setSpinClockwiseEnabled(spinClockwiseEnabled);
            setVerticalOscillationEnabled(verticalOscillationEnabled);


            // RESET SETTINGS
            var resetSettingsButton = document.getElementById("resetSettingsButton");
            resetSettingsButton.addEventListener("click", function(){
                resetSettings();
            });

            function resetSettings() {
                if (material1Color){
                    setMaterial(material1, jsonData.material1Color, material1ColorPicker);
                    material1Color = jsonData.material1Color;
                }
                if (material2Color){
                    setMaterial(material2, jsonData.material2Color, material2ColorPicker);
                    material2Color = jsonData.material2Color;
                }
                if (material3Color){
                    setMaterial(material3, jsonData.material3Color, material3ColorPicker);
                    material3Color = jsonData.material3Color;
                }
                if (material4Color){
                    setMaterial(material4, jsonData.material4Color, material4ColorPicker);
                    material4Color = jsonData.material4Color;
                }
                setMaterialRoughness(jsonData.materialRoughness);
                setDefaultCamaraYaw(jsonData.defaultCameraYaw);
                setDefaultCamaraPitch(jsonData.defaultCameraPitch);
                setBackgroundColorEnabled(jsonData.backgroundColorEnabled);
                setBackgroundColor(jsonData.backgroundColor);
                setInteractiveCameraEnabled(jsonData.interactiveCameraEnabled);
                setCameraSnapBackEnabled(jsonData.cameraSnapBackEnabled);
                setHorizontalSpinEnabled(jsonData.horizontalSpinEnabled);
                setSpinClockwiseEnabled(jsonData.spinClockwiseEnabled);
                setVerticalOscillationEnabled(jsonData.verticalOscillationEnabled);
            };

            // EXPORT CLOSE BUTTON
            var exportCloseButton = document.getElementById("exportCloseButton");

            // DOWNLOAD IMAGE
            var downloadImageButton = document.getElementById("downloadImageButton");
            var sizeSmall = document.getElementById("sizeRadioSmall");
            var sizeMedium = document.getElementById("sizeRadioMedium");
            var sizeLarge = document.getElementById("sizeRadioLarge");
            downloadImageButton.addEventListener("click", function() {
                renderCanvasContainer.classList.add("resize");
                engine.resize();
                var imageSize;
                if(sizeSmall.checked) {
                    imageSize = 1440;
                };
                if(sizeMedium.checked) {
                    imageSize = 2880;
                };
                if(sizeLarge.checked) {
                    imageSize = 4320;
                };
                BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, imageSize, undefined, undefined, undefined, undefined, collectionName + "_" + sceneName + "_Image");
                renderCanvasContainer.classList.remove("resize");
                engine.resize();
                exportCloseButton.click()
            });

            // DOWNLOAD FRAMES
            var downloadFramesButton = document.getElementById("downloadFramesButton");
            downloadFramesButton.addEventListener("click", function() {
                exportCloseButton.click()
                sceneContent.setAttribute("style", "display: none");
                generatingFrames.setAttribute("style", "display: block");
                renderCanvasContainer.classList.add("resize");
                engine.resize();
        
                var animFrames
                if(horizontalSpinEnabled){
                    animFrames = spinAnimGroup.to;
                }else{
                    animFrames = oscillateAnimGroup.to;
                }
                var frameHelper = animFrames
                var frames = new Array;  
                var startFrame = 1;
                function createFrames(){
                    if(startFrame <= animFrames){
                        if(horizontalSpinEnabled){
                            if(spinClockwiseEnabled){
                                spinAnimGroup.goToFrame(startFrame)
                            }else{
                                spinAnimGroup.goToFrame(animFrames)
                            }
                        }else{
                            spinAnimGroup.goToFrame(0)
                        }
                        if(verticalOscillationEnabled){
                            if(spinClockwiseEnabled){
                                oscillateAnimGroup.goToFrame(startFrame - (oscillateAnimGroup.to * Math.trunc(startFrame/oscillateAnimGroup.to)))
                            }else{
                                oscillateAnimGroup.goToFrame(animFrames - (oscillateAnimGroup.to * Math.trunc(animFrames/oscillateAnimGroup.to)))
                            }
                        }else{
                            oscillateAnimGroup.goToFrame(0)
                        }
                        if(spinClockwiseEnabled){
                            startFrame += 1
                            framesProgress.innerHTML = "Capturing frame: " + (startFrame-1) + " / " + animFrames;
                        }else{
                            animFrames -=1
                            framesProgress.innerHTML = "Capturing frame: " + (frameHelper-animFrames) + " / " + frameHelper;
                        }
                        BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, 720, function (data){
                            frames.push(data);
                            createFrames()
                        });
                    }else {
                        createAchive(frames);
                        framesProgress.innerHTML = "Generating archive ...";
                    }
                };
                createFrames();
            });


            function createAchive(toArchive){
                var zip = new JSZip();
                for(var i = 0; i < toArchive.length; i++ ){
                    var idx = toArchive[i].indexOf('base64,') + 'base64,'.length; // or = 28 if you're sure about the prefix
                    var content = toArchive[i].substring(idx);
                    zip.file(i+1 + '.png', content, {base64: true});
                }
                zip.generateAsync({
                    type: "base64"
                }).then(function(content) {
                    var link = document.createElement('a');
                    link.href = "data:application/zip;base64," + content;
                    link.download = collectionName + "_" + sceneName + "_Frames";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    sceneContent.setAttribute("style", "display: block");
                    generatingFrames.setAttribute("style", "display: none");
                    renderCanvasContainer.classList.remove("resize");
                    engine.resize();
                });
            };

            // DOWNLOAD SCENE
            var downloadSceneButton = document.getElementById("downloadSceneButton");
            downloadSceneButton.addEventListener("click", function() {
                async function downloadScene() {
                    const demoFile = await fetch("../../scenes/" + collectionName + "/_Download/DEMO.html").then(res => res.arrayBuffer());
                    const readmeFile = await fetch("../../scenes/" + collectionName + "/_Download/README.txt").then(res => res.arrayBuffer());
                    const sceneFile = await fetch("../../scenes/" + collectionName + "/_Download/scene.html").then(res => res.arrayBuffer());
                    const occlusionFile = await fetch("../../scenes/" + collectionName + "/" + sceneName + "/occlusion.png").then(res => res.arrayBuffer());
                    const environmentFile = await fetch("../../scenes/" + collectionName + "/environment.env").then(res => res.arrayBuffer());
                    const modelFile = await fetch("../../scenes/" + collectionName + "/" + sceneName + "/model.glb").then(res => res.arrayBuffer());
                    const managerFile = await fetch("../../scenes/" + collectionName + "/_Download/manager.js").then(res => res.arrayBuffer());
                    var settingsFile = {
                        "material1Color": material1Color,
                        "material2Color": material2Color,
                        "material3Color": material3Color,
                        "material4Color": material4Color,
                        "materialRoughness": materialRoughness,
                        "backgroundColorEnabled": backgroundColorEnabled,
                        "backgroundColor": backgroundColor,
                        "defaultCameraYaw": defaultCameraYaw,
                        "defaultCameraPitch": defaultCameraPitch,
                        "interactiveCameraEnabled": interactiveCameraEnabled,
                        "cameraSnapBackEnabled": cameraSnapBackEnabled,
                        "horizontalSpinEnabled": horizontalSpinEnabled,
                        "spinClockwiseEnabled": spinClockwiseEnabled,
                        "verticalOscillationEnabled": verticalOscillationEnabled
                    };
                    
                    var zip = new JSZip();
                    zip.file("DEMO.html", demoFile, {binary:true});
                    zip.file("README.txt", readmeFile, {binary:true});
                    zip.folder("ScenePick").file("scene.html", sceneFile, {binary:true});
                    zip.folder("ScenePick/assets").file("occlusion.png", occlusionFile, {binary:true});
                    zip.folder("ScenePick/assets").file("environment.env", environmentFile, {binary:true});
                    zip.folder("ScenePick/assets").file("model.glb", modelFile, {binary:true});
                    zip.folder("ScenePick/assets").file("manager.js", managerFile , {binary:true});
                    zip.folder("ScenePick/assets").file("settings.json", JSON.stringify(settingsFile), {binary:true});

                    zip.generateAsync({ 
                        type: "base64"
                    }).then(function(content) {
                        var link = document.createElement('a');
                        link.href = "data:application/zip;base64," + content;
                        link.download = collectionName + "_" + sceneName + "_Scene";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });
                }
                downloadScene();
                exportCloseButton.click()
            });

        });

        return scene;
    };

    const scene = createScene(); //Call the createScene function

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function() {
        scene.render();
    });

    // Watch for browser/renderCanvas resize events
    window.addEventListener("resize", function() {
        engine.resize();
        renderCanvas.width = window.innerWidth;
        renderCanvas.height = window.innerWidth;
    });

});


function checkForAnimation(){ //This is called when the export modal is opened
    if (horizontalSpinEnabledToggle.checked || verticalOscillationEnabledToggle.checked){
        downloadFramesButton.setAttribute("style", "display: block")
        downloadFramesError.setAttribute("style", "display: none")
    }else {
        downloadFramesButton.setAttribute("style", "display: none")
        downloadFramesError.setAttribute("style", "display: block")
    };
};