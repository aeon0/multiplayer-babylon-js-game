import { RouterService } from "./router.service";

const SERVER_URL: string = "ws://localhost:8900";

export namespace SocketService {

    let socket: WebSocket;
    let idCounter: number = 0;
    let sendCallbacks: { [id: string]: Function; } = {};

    export function init() {
        socket = new WebSocket(SERVER_URL);
        socket.onmessage = handleMessage;
        return socket;
    }

    function createMsgID(): string {
        idCounter++;
        // Buffer of 10 mio messages
        if (idCounter > 9999999) {
            idCounter = 0;
        }
        return "client_" + idCounter.toString();
    }

    export function send(type: string, msg: any = "", callback: Function = () => { }): void {
        let id = createMsgID();
        sendCallbacks[id] = callback;
        let json = JSON.stringify({ 
            type, 
            msg, 
            id, 
            origin: "client" 
        });
        socket.send(json);
    }

    function handleMessage(e) {
        let data: any = JSON.parse(e.data);
        
        if(data.origin === "client" && sendCallbacks[data.id] !== undefined){
            sendCallbacks[data.id](data);
        }
        else {
            RouterService.routeMessages(data);
        }
        
    }
}