import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server} from "socket.io"
@WebSocketGateway()
export class MyGateWay implements OnModuleInit {
    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on('connection', () => {
            console.log("socket connected");
        })
    }

    @SubscribeMessage('tasks')
    onTasks(@MessageBody() body:any) {
        this.server.emit('onTaskUpdate', {
            msg: "task updated"
        })
    }
}

