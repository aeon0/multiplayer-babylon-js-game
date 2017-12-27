System.register(["./state_machine", "./server", "./game"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var state_machine_1, server_1, game_1, States, Events, fsm, server, game;
    return {
        setters: [
            function (state_machine_1_1) {
                state_machine_1 = state_machine_1_1;
            },
            function (server_1_1) {
                server_1 = server_1_1;
            },
            function (game_1_1) {
                game_1 = game_1_1;
            }
        ],
        execute: function () {
            (function (States) {
                States[States["CONNECTING_TO_SERVER"] = 0] = "CONNECTING_TO_SERVER";
                States[States["LOADING_GAME"] = 1] = "LOADING_GAME";
                States[States["INIT_GAME_STATE"] = 2] = "INIT_GAME_STATE";
                States[States["RUN_GAME"] = 3] = "RUN_GAME";
                States[States["DEAD"] = 4] = "DEAD";
            })(States || (States = {}));
            exports_1("States", States);
            (function (Events) {
                Events[Events["CONNECTED"] = 0] = "CONNECTED";
                Events[Events["GAME_LOADED"] = 1] = "GAME_LOADED";
                Events[Events["STATE_INIT_DONE"] = 2] = "STATE_INIT_DONE";
            })(Events || (Events = {}));
            exports_1("Events", Events);
            exports_1("fsm", fsm = new state_machine_1.StateMachine({
                initial: States.CONNECTING_TO_SERVER,
                events: [
                    { name: Events.CONNECTED, from: States.CONNECTING_TO_SERVER, to: States.LOADING_GAME },
                    { name: Events.GAME_LOADED, from: States.LOADING_GAME, to: States.INIT_GAME_STATE },
                    { name: Events.STATE_INIT_DONE, from: States.INIT_GAME_STATE, to: States.RUN_GAME },
                ]
            }));
            server = new server_1.Server();
            fsm.onEnter(States.LOADING_GAME, function () {
                console.log("Create BabylonJS Game");
                game = new game_1.Game('renderCanvas');
                game.load();
            });
            fsm.onEnter(States.INIT_GAME_STATE, function () {
                console.log("Initilize Game State from Server");
                game.initGameState();
            });
            fsm.onEnter(States.RUN_GAME, function () {
                game.run();
            });
        }
    };
});
