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

    let messageMap: { [name: string]: Array<[any, Function]> } = {
        "update": [],
        "remove_player": []
    };

    export function routeMessages(msg: any) {
        if (messageMap[msg.type] !== undefined) {
            messageMap[msg.type].forEach(tuple => {
                tuple[1] = tuple[1].bind(tuple[0]);
                tuple[1](msg);
            })
        }
    }

    export function registerFunction(type: string, context: any, func: Function) {
        messageMap[type].push([context, func]);
    }
}