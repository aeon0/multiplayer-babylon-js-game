import { SocketService } from "./socket.service";

export namespace RouterService {

    // Messages from Client to Server
    // ==================================================

    export function initGameState(name: string, cb: Function) {
        // recive game state and initlizes the player into the game
        SocketService.send("init_game_state", { name }, cb);
    }

    export function sendInteraction(direction: BABYLON.Vector3, force: number) {
        let msg = {
            direction,
            force
        };
        SocketService.send("player_interaction", msg);
    }
    // ==================================================

    // the first value of the tuple [any, Function] is the context (usually 'this' of a class)
    let messageMap: { [name: string]: Array<Function> } = {
        "update": [],
        "remove_player": []
    };

    export function routeMessages(msg: any) {
        if (messageMap[msg.type] !== undefined) {
            messageMap[msg.type].forEach(func => {
                func(msg);
            })
        }
    }

    export function registerFunction(type: string, func: Function, context: any = null, ) {
        if(context !== null)
            func = func.bind(context);
        messageMap[type].push(func);
    }
}