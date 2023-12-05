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

fetch("./assets/settings.json") 

	.then(response => response.json()) 
	.then(jsonData => {

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

    var engine = new BABYLON.Engine(renderCanvas, true,);

    BABYLON.SceneLoader.ShowLoadingScreen = false ;

    const createScene = function () {
        const scene = new BABYLON.Scene(engine);
        scene.environmentTexture = new BABYLON.CubeTexture("./assets/environment.env");
        scene.environmentIntensity = 3;
        scene.useRightHandedSystem = true;

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

        setDefaultCamaraYaw(defaultCameraYaw);
        setDefaultCamaraPitch(defaultCameraPitch);
        setInteractiveCameraEnabled(interactiveCameraEnabled);

        function setDefaultCamaraYaw(value){
            defaultCameraYaw = value;
            cameraOrientationReset()
        };

        function setDefaultCamaraPitch(value){
            defaultCameraPitch = value;
            cameraOrientationReset()
        };

        function setInteractiveCameraEnabled(state) {
            cameraOrientationReset()
            if(state) {
                renderCanvasContainer.setAttribute("style", "pointer-events:revert")
                camera.attachControl(renderCanvas, true);
            }else {
                renderCanvasContainer.setAttribute("style", "pointer-events:none")
                camera.detachControl(renderCanvas, true);
            };
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

        setBackgroundColor(backgroundColor)
        setBackgroundColorEnabled(backgroundColorEnabled);


        function setBackgroundColor(color){
            scene.clearColor = new BABYLON.Color3.FromHexString(color);
            backgroundColor = color;
        };

        function setBackgroundColorEnabled(state) {
            if(!state){
                scene.clearColor = new BABYLON.Color4(0,0,0,0);
            };
        };

        BABYLON.SceneLoader.Append("./", "assets/model.glb", scene, function (scene) {
            scene.executeWhenReady( ()=> {
                renderCanvas.style.opacity = "1";
            });

            var materials = []

            if(material1Color){
                var material1 = scene.getMaterialById("material1");
                materials.push(material1);
                setMaterial(material1, material1Color);
            };

            if(material2Color){
                var material2 = scene.getMaterialById("material2");
                materials.push(material2);
                setMaterial(material2, material2Color);
            };

            if(material3Color){
                var material3 = scene.getMaterialById("material3");
                materials.push(material3);
                setMaterial(material3, material3Color);
            };

            if(material4Color){
                var material4 = scene.getMaterialById("material4");
                materials.push(material4);
                setMaterial(material4, material4Color);
            };

            for(var i = 0; i < materials.length; i++) {
                materials[i].roughness = 1;
                materials[i].clearCoat.isEnabled = true;
                materials[i].clearCoat.roughness = materialRoughness;
                materials[i].clearCoat.isTintEnabled = true;
                materials[i].albedoTexture = new BABYLON.Texture("./assets/occlusion.png", scene, true, false);
            };

            function setMaterial(material, color) {
                material.albedoColor = new BABYLON.Color3.FromHexString(color);
                material.clearCoat.tintColor = new BABYLON.Color3.FromHexString(color);

            };
            
            const centerNode = new BABYLON.TransformNode("root");
            const meshes = scene.meshes;
            for(var i = 0; i < meshes.length; i++) {
                meshes[i].parent = centerNode;
            };

            var horizontalSpinSpeed = 30;
            var spinAnim = new BABYLON.Animation("spinAnim", "rotation", horizontalSpinSpeed, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            var spinKeys = [];
            spinKeys.push({ frame: 0, value: new BABYLON.Vector3(0, BABYLON.Tools.ToRadians(0), 0) });
            spinKeys.push({ frame: 360, value: new BABYLON.Vector3(0, BABYLON.Tools.ToRadians(360), 0) });
            spinAnim.setKeys(spinKeys);
            var spinAnimGroup = new BABYLON.AnimationGroup("spinAnimGroup");
            spinAnimGroup.addTargetedAnimation(spinAnim, centerNode);

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

            function setHorizontalSpinEnabled(state) {
                if(state) {
                    spinAnimGroup.play(true);
                };
            };

            function setSpinClockwiseEnabled(state) {
                if(!state) {
                    spinAnim.framePerSecond = -horizontalSpinSpeed;
                };
            };

            function setVerticalOscillationEnabled(state) {
                if(state) {
                    oscillateAnimGroup.play(true);
                };
            };
            
            setHorizontalSpinEnabled(horizontalSpinEnabled);
            setSpinClockwiseEnabled(spinClockwiseEnabled);
            setVerticalOscillationEnabled(verticalOscillationEnabled);

        });

        return scene;
    };

    const scene = createScene();

    engine.runRenderLoop(function() {
        scene.render();
    });

    window.addEventListener("resize", function() {
        engine.resize();
        renderCanvas.width = window.innerWidth;
        renderCanvas.height = window.innerWidth;
    });

});