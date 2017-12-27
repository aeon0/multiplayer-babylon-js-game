System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Enemy;
    return {
        setters: [],
        execute: function () {
            Enemy = (function () {
                function Enemy(scene, id) {
                    this.scene = scene;
                    this.id = id;
                }
                Enemy.prototype.init = function (lights) {
                    this.playerMesh = BABYLON.Mesh.CreateSphere("enemy_obj", 12, 4, this.scene);
                    var playerMaterial = new BABYLON.StandardMaterial("player_material", this.scene);
                    playerMaterial.diffuseTexture = new BABYLON.Texture("public/assets/textures/basketball.jpg", this.scene);
                    this.playerMesh.material = playerMaterial;
                    this.playerMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.playerMesh, BABYLON.PhysicsImpostor.SphereImpostor, {
                        mass: 1,
                        friction: 100
                    }, this.scene);
                    lights.addShadowCaster(this.playerMesh);
                };
                Enemy.prototype.update = function (linearVelocity, angularVelocity, position) {
                    this.playerMesh.physicsImpostor.setAngularVelocity(angularVelocity);
                    this.playerMesh.physicsImpostor.setLinearVelocity(linearVelocity);
                    this.playerMesh.position = position;
                };
                return Enemy;
            }());
            exports_1("Enemy", Enemy);
        }
    };
});
