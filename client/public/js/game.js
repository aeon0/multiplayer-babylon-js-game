System.register(["./lights", "./camera", "./player", "./enemy", "./area", "./routing/router.service", "./controller"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lights_1, camera_1, player_1, enemy_1, area_1, router_service_1, controller_1, Game;
    return {
        setters: [
            function (lights_1_1) {
                lights_1 = lights_1_1;
            },
            function (camera_1_1) {
                camera_1 = camera_1_1;
            },
            function (player_1_1) {
                player_1 = player_1_1;
            },
            function (enemy_1_1) {
                enemy_1 = enemy_1_1;
            },
            function (area_1_1) {
                area_1 = area_1_1;
            },
            function (router_service_1_1) {
                router_service_1 = router_service_1_1;
            },
            function (controller_1_1) {
                controller_1 = controller_1_1;
            }
        ],
        execute: function () {
            Game = (function () {
                function Game(canvasElement) {
                    var _this = this;
                    this.enemys = {};
                    this.canvas = document.getElementById(canvasElement);
                    this.engine = new BABYLON.Engine(this.canvas, true);
                    this.scene = new BABYLON.Scene(this.engine);
                    this.lights = new lights_1.Lights(this.scene);
                    this.camera = new camera_1.Camera(this.scene);
                    this.area = new area_1.Area(this.scene);
                    router_service_1.RouterService.registerFunction('update', this, this.updateWorld);
                    router_service_1.RouterService.registerFunction('remove_player', this, this.removeEnemy);
                    window.addEventListener("resize", function () {
                        _this.engine.resize();
                    });
                }
                Game.prototype.load = function () {
                    this.scene.clearColor = new BABYLON.Color4(0.09, 0.09, 0.09, 1);
                    this.scene.enablePhysics(new BABYLON.Vector3(0, -20, 0), new BABYLON.OimoJSPlugin());
                    this.lights.init();
                    this.area.init();
                    this.scene.executeWhenReady(function () {
                        controller_1.fsm.input(controller_1.Events.GAME_LOADED);
                    });
                };
                Game.prototype.initGameState = function () {
                    var _this = this;
                    router_service_1.RouterService.initGameState("default_name", function (data) {
                        var playerId = data.playerId;
                        var allPlayers = data.players;
                        Object.keys(allPlayers).forEach(function (key) {
                            var linVelo = _this.createVector(allPlayers[key].linearVelocity);
                            var angVelo = _this.createVector(allPlayers[key].angularVelocity);
                            var postion = _this.createVector(allPlayers[key].position);
                            if (key === playerId) {
                                console.log("Create Player");
                                _this.player = new player_1.Player(_this.scene, playerId);
                                _this.player.init(_this.lights);
                                _this.player.update(linVelo, angVelo, postion);
                                _this.camera.init(_this.player.playerMesh);
                            }
                            else {
                                var enemy = new enemy_1.Enemy(_this.scene, key);
                                enemy.init(_this.lights);
                                enemy.update(linVelo, angVelo, postion);
                                _this.enemys[key] = enemy;
                            }
                        });
                        controller_1.fsm.input(controller_1.Events.STATE_INIT_DONE);
                    });
                };
                Game.prototype.updateWorld = function (msg) {
                    var _this = this;
                    Object.keys(msg.players).forEach(function (key) {
                        var config = msg.players[key];
                        var linVelo = _this.createVector(config.linearVelocity);
                        var angVelo = _this.createVector(config.angularVelocity);
                        var postion = _this.createVector(config.position);
                        if (key === _this.player.id) {
                            _this.player.update(linVelo, angVelo, postion);
                        }
                        else {
                            var enemy = _this.enemys[key];
                            if (enemy !== undefined) {
                                enemy.update(linVelo, angVelo, postion);
                            }
                            else {
                                var enemy_2 = new enemy_1.Enemy(_this.scene, key);
                                enemy_2.init(_this.lights);
                                enemy_2.update(linVelo, angVelo, postion);
                                _this.enemys[key] = enemy_2;
                            }
                        }
                    });
                };
                Game.prototype.removeEnemy = function (msg) {
                    var enemy = this.enemys[msg.key];
                    if (enemy !== undefined) {
                        enemy.playerMesh.dispose();
                        delete this.enemys[msg.key];
                    }
                };
                Game.prototype.run = function () {
                    var _this = this;
                    this.engine.runRenderLoop(function () {
                        var deltaTime = _this.engine.getDeltaTime();
                        _this.player.applyMovement(_this.camera, deltaTime);
                        _this.camera.followCamera();
                        _this.scene.render();
                        var fpsLabel = document.getElementById("fps_label");
                        fpsLabel.innerHTML = _this.engine.getFps().toFixed() + " fps";
                    });
                };
                Game.prototype.createVector = function (config) {
                    var vec = new BABYLON.Vector3(config.x, config.y, config.z);
                    return vec;
                };
                return Game;
            }());
            exports_1("Game", Game);
        }
    };
});
