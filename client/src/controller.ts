// Entry point of the application

import { StateMachine } from './state_machine';
import { Server } from './server';
import { Game } from './game';


export enum States {
    CONNECTING_TO_SERVER,
    LOADING_GAME,
    INIT_GAME_STATE,
    RUN_GAME,
    DEAD
}

export enum Events {
    CONNECTED,
    GAME_LOADED,
    STATE_INIT_DONE,
}

export let fsm = new StateMachine<States, Events>({
    initial: States.CONNECTING_TO_SERVER,
    events: [
        { name: Events.CONNECTED, from: States.CONNECTING_TO_SERVER, to: States.LOADING_GAME },
        { name: Events.GAME_LOADED, from: States.LOADING_GAME, to: States.INIT_GAME_STATE },
        { name: Events.STATE_INIT_DONE, from: States.INIT_GAME_STATE, to: States.RUN_GAME },
    ]
});


// Created Instances
// =========================================
let server = new Server();
let game: Game;


// Do stuff when reaching a new state
// =========================================

fsm.onEnter(States.LOADING_GAME, () => {
    console.log("Create BabylonJS Game");
    game = new Game('renderCanvas');
    game.load();
});

fsm.onEnter(States.INIT_GAME_STATE, () => {
    console.log("Initilize Game State from Server");
    game.initGameState();
})

fsm.onEnter(States.RUN_GAME, () => {
    game.run();
})

