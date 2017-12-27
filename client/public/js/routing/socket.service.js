System.register(["./router.service"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var router_service_1, SERVER_URL, SocketService;
    return {
        setters: [
            function (router_service_1_1) {
                router_service_1 = router_service_1_1;
            }
        ],
        execute: function () {
            SERVER_URL = "ws://localhost:8900";
            (function (SocketService) {
                var socket;
                var idCounter = 0;
                var sendCallbacks = {};
                function init() {
                    socket = new WebSocket(SERVER_URL);
                    socket.onmessage = handleMessage;
                    return socket;
                }
                SocketService.init = init;
                function createMsgID() {
                    idCounter++;
                    if (idCounter > 9999999) {
                        idCounter = 0;
                    }
                    return "client_" + idCounter.toString();
                }
                function send(type, msg, callback) {
                    if (msg === void 0) { msg = ""; }
                    if (callback === void 0) { callback = function () { }; }
                    var id = createMsgID();
                    sendCallbacks[id] = callback;
                    var json = JSON.stringify({
                        type: type,
                        msg: msg,
                        id: id,
                        origin: "client"
                    });
                    socket.send(json);
                }
                SocketService.send = send;
                function handleMessage(e) {
                    var data = JSON.parse(e.data);
                    if (data.origin === "client" && sendCallbacks[data.id] !== undefined) {
                        sendCallbacks[data.id](data);
                    }
                    else {
                        router_service_1.RouterService.routeMessages(data);
                    }
                }
            })(SocketService || (SocketService = {}));
            exports_1("SocketService", SocketService);
        }
    };
});
