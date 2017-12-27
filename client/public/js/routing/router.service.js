System.register(["./socket.service"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var socket_service_1, RouterService;
    return {
        setters: [
            function (socket_service_1_1) {
                socket_service_1 = socket_service_1_1;
            }
        ],
        execute: function () {
            (function (RouterService) {
                function initGameState(name, cb) {
                    socket_service_1.SocketService.send("init_game_state", { name: name }, cb);
                }
                RouterService.initGameState = initGameState;
                function sendInteraction(direction, force) {
                    var msg = {
                        direction: direction,
                        force: force
                    };
                    socket_service_1.SocketService.send("player_interaction", msg);
                }
                RouterService.sendInteraction = sendInteraction;
                var messageMap = {
                    "update": [],
                    "remove_player": []
                };
                function routeMessages(msg) {
                    if (messageMap[msg.type] !== undefined) {
                        messageMap[msg.type].forEach(function (tuple) {
                            tuple[1] = tuple[1].bind(tuple[0]);
                            tuple[1](msg);
                        });
                    }
                }
                RouterService.routeMessages = routeMessages;
                function registerFunction(type, context, func) {
                    messageMap[type].push([context, func]);
                }
                RouterService.registerFunction = registerFunction;
            })(RouterService || (RouterService = {}));
            exports_1("RouterService", RouterService);
        }
    };
});
