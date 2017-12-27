System.register(["./routing/socket.service", "./controller"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var socket_service_1, controller_1, Server;
    return {
        setters: [
            function (socket_service_1_1) {
                socket_service_1 = socket_service_1_1;
            },
            function (controller_1_1) {
                controller_1 = controller_1_1;
            }
        ],
        execute: function () {
            Server = (function () {
                function Server() {
                    var socket = socket_service_1.SocketService.init();
                    console.log("Start Server");
                    socket.onopen = function () {
                        console.log("Connected to Server");
                        controller_1.fsm.input(controller_1.Events.CONNECTED);
                    };
                }
                return Server;
            }());
            exports_1("Server", Server);
        }
    };
});
