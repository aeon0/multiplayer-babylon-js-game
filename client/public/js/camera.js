System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Camera;
    return {
        setters: [],
        execute: function () {
            Camera = (function () {
                function Camera(scene) {
                    this.radius = 40;
                    this.scene = scene;
                    this.canvas = scene.getEngine().getRenderingCanvas();
                }
                Camera.prototype.init = function (playerMesh) {
                    var _this = this;
                    this.camera = new BABYLON.ArcRotateCamera("player_camera", 1, 1.4, this.radius, playerMesh.position, this.scene);
                    this.camera.lowerRadiusLimit = 0.5;
                    this.camera.upperRadiusLimit = 100;
                    this.followMesh = playerMesh;
                    this.canvas.addEventListener("click", function (evt) {
                        _this.canvas.requestPointerLock = _this.canvas.requestPointerLock ||
                            _this.canvas.msRequestPointerLock ||
                            _this.canvas.mozRequestPointerLock ||
                            _this.canvas.webkitRequestPointerLock;
                        if (_this.canvas.requestPointerLock) {
                            _this.canvas.requestPointerLock();
                        }
                    }, false);
                    document.addEventListener("pointerlockchange", function (evt) { return _this.pointerlockchange(evt); }, false);
                    document.addEventListener("mspointerlockchange", function (evt) { return _this.pointerlockchange(evt); }, false);
                    document.addEventListener("mozpointerlockchange", function (evt) { return _this.pointerlockchange(evt); }, false);
                    document.addEventListener("webkitpointerlockchange", function (evt) { return _this.pointerlockchange(evt); }, false);
                };
                Camera.prototype.pointerlockchange = function (event) {
                    var controlEnabled = (document.mozPointerLockElement === this.canvas
                        || document.webkitPointerLockElement === this.canvas
                        || document.msPointerLockElement === this.canvas
                        || document.pointerLockElement === this.canvas);
                    if (!controlEnabled) {
                    }
                    else {
                    }
                };
                ;
                Camera.prototype.getCamDirection = function () {
                    return this.camera.getTarget().subtract(this.camera.position).normalize();
                };
                Camera.prototype.changeCameraRotation = function (deltaAlpha, deltaBeta) {
                    if (deltaAlpha === void 0) { deltaAlpha = null; }
                    if (deltaBeta === void 0) { deltaBeta = null; }
                    if (deltaAlpha !== null) {
                        var newAlpha = this.camera.alpha + deltaAlpha;
                        this.camera.alpha = newAlpha;
                    }
                };
                Camera.prototype.followCamera = function () {
                    var newTarget = this.followMesh.position.clone();
                    newTarget.y += 2;
                    var alpha = this.camera.alpha;
                    var beta = this.camera.beta;
                    this.camera.target = newTarget;
                    this.camera.radius = this.radius;
                    this.camera.beta = beta;
                    this.camera.alpha = alpha;
                };
                return Camera;
            }());
            exports_1("Camera", Camera);
        }
    };
});
