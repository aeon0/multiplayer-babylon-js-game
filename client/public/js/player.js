System.register(["./routing/router.service"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var router_service_1, LEFT, RIGHT, UP, DOWN, JUMP, Player;
    return {
        setters: [
            function (router_service_1_1) {
                router_service_1 = router_service_1_1;
            }
        ],
        execute: function () {
            LEFT = 65;
            RIGHT = 68;
            UP = 87;
            DOWN = 83;
            JUMP = 32;
            Player = (function () {
                function Player(scene, id) {
                    this.keyDown = {};
                    this.scene = scene;
                    this.id = id;
                }
                Player.prototype.init = function (lights) {
                    var _this = this;
                    this.playerMesh = BABYLON.Mesh.CreateSphere("player_obj", 12, 4, this.scene);
                    this.playerMesh.position.y = 16;
                    var playerMaterial = new BABYLON.StandardMaterial("player_material", this.scene);
                    playerMaterial.diffuseTexture = new BABYLON.Texture("public/assets/textures/green_tennis_ball.jpg", this.scene);
                    this.playerMesh.material = playerMaterial;
                    this.playerMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.playerMesh, BABYLON.PhysicsImpostor.SphereImpostor, {
                        mass: 1,
                        friction: 100
                    }, this.scene);
                    lights.addShadowCaster(this.playerMesh);
                    window.addEventListener('keydown', function (event) { _this.keyDownEvt(event); }, false);
                    window.addEventListener('keyup', function (event) { _this.keyUpEvt(event); }, false);
                };
                Player.prototype.keyDownEvt = function (evt) {
                    this.keyDown[evt.keyCode] = true;
                };
                Player.prototype.keyUpEvt = function (evt) {
                    this.keyDown[evt.keyCode] = false;
                };
                Player.prototype.applyMovement = function (camera, deltaTime) {
                    var contactPoint = this.playerMesh.absolutePosition.clone();
                    contactPoint.y += 20;
                    var force = 0.002 * deltaTime;
                    var direction = camera.getCamDirection().multiplyByFloats(force, force, force);
                    if (this.keyDown[UP]) {
                        this.playerMesh.applyImpulse(direction, contactPoint);
                        router_service_1.RouterService.sendInteraction(camera.getCamDirection(), force);
                    }
                    if (this.keyDown[DOWN]) {
                        this.playerMesh.applyImpulse(direction.negate(), contactPoint);
                        router_service_1.RouterService.sendInteraction(camera.getCamDirection().negate(), force);
                    }
                    if (this.keyDown[LEFT]) {
                        camera.changeCameraRotation(0.06);
                    }
                    if (this.keyDown[RIGHT]) {
                        camera.changeCameraRotation(-0.06);
                    }
                    if (this.keyDown[JUMP]) {
                        console.log(this.playerMesh.position);
                        if (this.playerMesh.position.y < 3) {
                            var jump_direction = new BABYLON.Vector3(0, 70, 0);
                            var jump = jump_direction.multiplyByFloats(force, force, force);
                            this.playerMesh.applyImpulse(direction.negate(), this.playerMesh.absolutePosition);
                            router_service_1.RouterService.sendInteraction(jump_direction, force);
                        }
                    }
                };
                Player.prototype.update = function (linearVelocity, angularVelocity, position) {
                    this.playerMesh.physicsImpostor.setAngularVelocity(angularVelocity);
                    this.playerMesh.physicsImpostor.setLinearVelocity(linearVelocity);
                    this.playerMesh.position = position;
                };
                return Player;
            }());
            exports_1("Player", Player);
        }
    };
});
