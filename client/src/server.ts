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

            // Start sending ping every 3 seconds
            let pingLabel = document.getElementById("ping_label");
            setInterval(() => {
                SocketService.send("ping", Date.now(), (data) => {
                    let ping = Date.now() - data.ts;

                    pingLabel.innerHTML = ping + " ping (ms)";
                });
            }, 3000); 
        }
    }
}