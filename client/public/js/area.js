System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Area;
    return {
        setters: [],
        execute: function () {
            Area = (function () {
                function Area(scene) {
                    this.mesh = [];
                    this.scene = scene;
                }
                Area.prototype.init = function () {
                    var _this = this;
                    var plane = BABYLON.Mesh.CreateGround("ground1", 460, 460, 2, this.scene);
                    var planeMaterial = new BABYLON.StandardMaterial("player_material", this.scene);
                    planeMaterial.diffuseColor = new BABYLON.Color3(0.6, 0.65, 0.64);
                    plane.material = planeMaterial;
                    this.mesh.push(plane);
                    var cylinderMesh = BABYLON.Mesh.CreateCylinder("object", 20, 30, 30, 5, 5, this.scene);
                    var cylinderMaterial = new BABYLON.StandardMaterial("player_material", this.scene);
                    cylinderMaterial.diffuseColor = new BABYLON.Color3(0.36, 0.4, 0.4);
                    cylinderMesh.material = cylinderMaterial;
                    this.mesh.push(cylinderMesh);
                    var wall_top = BABYLON.MeshBuilder.CreateBox("wall_top", { width: 460, height: 20, depth: 20 }, this.scene);
                    var wall_bottom = wall_top.clone("wall_bottom");
                    var wall_left = wall_top.clone("wall_left");
                    var wall_right = wall_top.clone("wall_right");
                    wall_top.position.z = 230;
                    wall_bottom.position.z = -230;
                    wall_left.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI / 2);
                    wall_left.position.x = 230;
                    wall_right.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI / 2);
                    wall_right.position.x = -230;
                    this.mesh.push(wall_top);
                    this.mesh.push(wall_bottom);
                    this.mesh.push(wall_left);
                    this.mesh.push(wall_right);
                    this.mesh.forEach(function (element) {
                        element.physicsImpostor = new BABYLON.PhysicsImpostor(element, BABYLON.PhysicsImpostor.BoxImpostor, {
                            mass: 0,
                            restitution: 0.3,
                            friction: 100
                        }, _this.scene);
                        element.receiveShadows = true;
                    });
                };
                return Area;
            }());
            exports_1("Area", Area);
        }
    };
});
