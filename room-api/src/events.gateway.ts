import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type Participant = {
    id: string;
    name: string;
    status: string;
    roomId: string;
}

type Message = {
    id: string;
    text: string;
    senderId: string;
    roomId: string;
}

const participantList: Map<string, Participant[]> = new Map();

const messageList: Map<string, Message[]> = new Map();

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class EventsGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket): any {
        client.on('createRoom', function (room) {
            console.log("create room called", room);
            client.join(room);
            this.server.to(client.id).emit('roomCreated', { room: room });
            this.server.to(client.id).emit('messageList', messageList.get(room) || []);
            this.server.to(client.id).emit('participantList', participantList.get(room) || []);
            console.log("here");
        });

        client.on('disconnecting', function () {
            console.log(`DISCONNECTING: ${Array.from(client.rooms)}`); // Set { ... }
            const rooms = Array.from(client.rooms);
            for (const room of rooms) {
                this.server.to(room).emit('participantLeft', {})
            }
        });
    }

    @SubscribeMessage('leave')
    async leave(@MessageBody() participant: Participant) {
        console.log("leave", participant);
    }

    @SubscribeMessage('newParticipant')
    async addParticipant(@MessageBody() participant: Participant) {
        console.log("new participant", participant);
        const list = participantList.get(participant.roomId) ? [...participantList.get(participant.roomId)] : [];
        list.push(participant);
        participantList.set(participant.roomId, list);
        this.server.to(participant.roomId).emit('newParticipant', participant);
    }

    @SubscribeMessage('updateStatus')
    async updateStatus(@MessageBody() participant: Participant) {
        console.log("update status", participant);
        const list = [...participantList.get(participant.roomId)];
        for (const obj of list) {
            if (obj.id === participant.id) {
                obj.status = participant.status;

                break;
            }
        }
        participantList.set(participant.roomId, list);
        console.log(participantList);
        this.server.to(participant.roomId).emit('newParticipantStatus', participant);
    }

    @SubscribeMessage('sendMessage')
    async createRoom(@MessageBody() message: Message) {
        console.log("new message", message);
        const list = messageList.get(message.roomId) ? [...messageList.get(message.roomId)] : [];
        list.push(message);
        messageList.set(message.roomId, list);
        this.server.to(message.roomId).emit('newMessage', message);
    }
}