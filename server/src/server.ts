import { World } from './world';
//import * as WebSocket from 'ws';
import { Server } from 'ws';
import { Router } from './router';


export class SocketServer {
    public static readonly PORT:number = 8900;
    private server: Server;
    private port: number;
    private world: World;
    private players: Map<any, any>;

    constructor() {
        this.players = new Map();

        this.init();
        this.listen(); 
    }

    private init(): void {
        this.world = new World();
        this.world.init();

        this.server = new Server({ port: SocketServer.PORT });

        Router.world = this.world;
        Router.server = this;
    }

    public setPlayerId(client: any, id: string){
        this.players.set(client, id);
    }

    private listen(): void {
        console.log("Start Listening on Port: " + SocketServer.PORT);
        this.server.on('connection', (client: any) => {
            // save the new client
            console.log("Client connected");
            this.players.set(client, null);

            client.on('message', (message: any) => {
                if(this.players.has(client)){
                    let playerId = this.players.get(client);
                    // Forward message to router
                    let msg = JSON.parse(message);
                    Router.routeMessage(msg, client, playerId);
                }
                else{
                    console.error("ERROR: Players Map does not include Client!");
                }
            });

            client.on('close', () => {
                console.log("Client connection closed");
                let id = this.players.get(client);
                this.world.removePlayer(id);
                this.players.delete(client);

                Router.removePlayer(id); 
            });
            client.on('error', () => {
                console.log("Client connection throw an error");
            });
        });
    }

    public broadCast(data: string){
        this.server.clients.forEach( (client) => {
            if(this.players.get(client) !== null){
                client.send(data);
            }
        });
    }
}