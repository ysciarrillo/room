import {
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

type Participant = {
    id: string;
    name: string;
    status: string;
    roomId: string;
}

type Message = {
    id: string;
    text: string;
    senderName: string;
    senderId: string;
    roomId: string;
}

const participantList: Map<string, Participant[]> = new Map();

const messageList: Map<string, Message[]> = new Map();

@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
export class EventsGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket): any {
        client.on("createRoom", function (room) {
            client.join(room);

            this.server.to(client.id).emit("roomCreated", { room: room });
            this.server.to(client.id).emit("messageList", messageList.get(room) || []);
            this.server.to(client.id).emit("participantList", participantList.get(room) || []);
        });
    }

    @SubscribeMessage("newParticipant")
    async addParticipant(@MessageBody() participant: Participant): Promise<void> {
        const list = participantList.get(participant.roomId) ? [...participantList.get(participant.roomId)] : [];
        list.push(participant);
        participantList.set(participant.roomId, list);

        this.server.to(participant.roomId).emit("newParticipant", participant);
    }

    @SubscribeMessage("updateStatus")
    async updateStatus(@MessageBody() participant: Participant): Promise<void> {
        const list = [...participantList.get(participant.roomId)];

        for (const obj of list) {
            if (obj.id === participant.id) {
                obj.status = participant.status;

                break;
            }
        }

        participantList.set(participant.roomId, list);

        this.server.to(participant.roomId).emit("newParticipantStatus", participant);
    }

    @SubscribeMessage("sendMessage")
    async createRoom(@MessageBody() message: Message): Promise<void> {
        const list = messageList.get(message.roomId) ? [...messageList.get(message.roomId)] : [];
        list.push(message);
        messageList.set(message.roomId, list);

        this.server.to(message.roomId).emit("newMessage", message);
    }
}