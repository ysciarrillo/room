import { useEffect, useState } from "react";
import {
    useParams
} from "react-router-dom";
import socketio from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import NameForm from "./NameForm";
import ParticipantList from "./participant/ParticipantList";
import ChatContainer from "./chat/ChatContainer";
import "./Room.css";

class Message {
    constructor(text, senderName, senderId, roomId) {
        this.id = uuidv4();
        this.text = text;
        this.senderName = senderName;
        this.senderId = senderId;
        this.roomId = roomId;
    }
}

class Participant {
    constructor(name, roomId) {
        this.id = uuidv4();
        this.name = name;
        this.status = "";
        this.roomId = roomId;
    }
}

function Room() {
    const socket = socketio.connect("http://localhost:3000");
    const { roomId } = useParams();

    useEffect(() => {
        socket.on("connect", function () {
            console.log("Connected");
            socket.emit("createRoom", roomId);
        });

        socket.on("exception", function (data) {
            console.log("exception", data);
        });
        socket.on("disconnect", function () {
            console.log("Disconnected");
        });
        socket.on("roomCreated", function (data) {
            console.log("Room created", data.room);
        });

        socket.on("leave", function (data) {
            console.log("Room created", data.room);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("exception");
            socket.off("roomCreated");
        };
    }, [roomId]);

    const [messageList, setMessageList] = useState([]);
    const [participantList, setParticipantList] = useState([]);
    const [me, setMe] = useState();
    const [formSubmitted, setFormSubmitted] = useState(false);

    useEffect(() => {
        socket.on("newParticipant", function (participant) {
            setParticipantList((prevValue) => ([...prevValue, participant]));
        });

        socket.on("newMessage", function (message) {
            setMessageList((prevValue) => ([...prevValue, message]));
        });

        socket.on("messageList", function (data) {
            setMessageList(data);
        });

        socket.on("participantList", function (data) {
            setParticipantList(data);
        });

        return () => {
            socket.off("newParticipant");
            socket.off("newMessage");
            socket.off("messageList");
            socket.off("participantList");
        };
    }, []);

    useEffect(() => {
        socket.on("newParticipantStatus", (participant) => {
            setParticipantList((prevValue) => {
                const list = [...prevValue];

                let item = list.find((el) => el.id === participant.id);
                const index = list.indexOf(item);

                let newArr = [
                    ...list.slice(0, index),
                    participant,
                    ...list.slice(index + 1),
                ];

                return newArr;
            });

        });

        return () => {
            socket.off("newParticipantStatus");
        };
    }, []);

    const sendMessage = (message) => {
        socket.emit("sendMessage", new Message(message, me.name, me.id, roomId));
    }

    const handleMyName = (name) => {
        const tempMe = new Participant(name, roomId);
        setMe(tempMe);
        setFormSubmitted(true);
        socket.emit("newParticipant", tempMe);
    }

    const updateStatus = (status) => {
        setMe((prevValue) => {
            return { ...prevValue, status }
        });
        socket.emit("updateStatus", { ...me, status });
    }

    return (
        <div className="main">
            {
                !me || !formSubmitted
                    ? <NameForm handleName={handleMyName} />
                    :
                    <div className="container">
                        <ParticipantList participantList={participantList} me={me} updateStatus={updateStatus} />
                        <ChatContainer messageList={messageList} sendMessage={sendMessage} />
                    </div>
            }
        </div>
    );
}

export default Room;