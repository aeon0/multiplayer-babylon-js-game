System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Lights;
    return {
        setters: [],
        execute: function () {
            Lights = (function () {
                function Lights(scene) {
                    this.shadowGenerator = null;
                    this.scene = scene;
                }
                Lights.prototype.init = function (useShadowGenerator) {
                    if (useShadowGenerator === void 0) { useShadowGenerator = true; }
                    this.light = new BABYLON.HemisphericLight('lightHs', new BABYLON.Vector3(0.2, 1, 0.2), this.scene);
                    this.light.specular = new BABYLON.Color3(0.1, 0.1, 0.1);
                    this.light.intensity = 0.8;
                    this.lightDirectional = new BABYLON.DirectionalLight("lightDir", new BABYLON.Vector3(-2, -4, 2), this.scene);
                    this.lightDirectional.diffuse = new BABYLON.Color3(0.2, 0.2, 0.2);
                    this.lightDirectional.specular = new BABYLON.Color3(0, 0, 0);
                    this.lightDirectional.position = new BABYLON.Vector3(250, 250, 0);
                    this.lightDirectional.intensity = 1.5;
                    if (useShadowGenerator) {
                        this.shadowGenerator = new BABYLON.ShadowGenerator(4192, this.lightDirectional);
                        this.shadowGenerator.useVarianceShadowMap = true;
                    }
                };
                Lights.prototype.addShadowCaster = function (mesh) {
                    this.shadowGenerator.getShadowMap().renderList.push(mesh);
                };
                return Lights;
            }());
            exports_1("Lights", Lights);
        }
    };
});
