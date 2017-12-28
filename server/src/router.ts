// Provides events for incomming messages as well as
// function to send messages to the clients 
import { players } from './state';
import { World } from './world';
import { SocketServer } from './server';


export namespace Router {
    export let world: World;
    export let server: SocketServer;

    let messageMap: { [key: string]: Function } = {
        "player_interaction": reciveInteraction,
        "init_game_state": initPlayer,
        "ping": sendPong,
    }

    export function routeMessage(msg: any, client: WebSocket, playerId: string) {
        if (messageMap[msg.type] !== undefined) {
            messageMap[msg.type](msg.msg, playerId, client, msg.origin, msg.id, );
        }
    }

    function sendPong(data: any, playerId: string, client: WebSocket, origin: string, requestId: string){
        client.send(JSON.stringify({
            ts: data,
            origin,
            id: requestId
        }))
    }
 
    function reciveInteraction(data: any, playerId: string) {
        world.applyMovment(playerId, data);
    }

    function initPlayer(data: any, playerId: string, client: WebSocket, origin: string, requestId: string) {
        playerId = createID();

        world.createPlayer(playerId, data.name);

        client.send(JSON.stringify({
            players,
            playerId,
            origin,
            id: requestId
        }));

        server.setPlayerId(client, playerId);
    }


    // Static Messages to the clients
    // ===================================================

    export function updateWorld() {
        let msg = {
            type: "update",
            players: players
        }

        server.broadCast(JSON.stringify(msg));
    }

    export function removePlayer(key: string) {
        let msg = {
            type: "remove_player",
            key: key
        }

        server.broadCast(JSON.stringify(msg));
    }


    // Helper functions
    // =========================================
    function createID(){
        return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

}