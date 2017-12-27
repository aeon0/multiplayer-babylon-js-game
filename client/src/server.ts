import { Game } from "./game";
import { SocketService } from "./routing/socket.service";
import { fsm, Events } from "./controller";


export class Server {
    constructor() {
        // Initilize the socket server
        let socket: WebSocket = SocketService.init();
        console.log("Start Server");
        // After succesfull connection start the game
        socket.onopen = () => {
            console.log("Connected to Server");
            fsm.input(Events.CONNECTED);
        }
    }
}

//let server = new Server();