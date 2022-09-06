import MessageList from "./MessageList";
import { useState } from "react";
import "./ChatContainer.css";
import { ReactComponent as SendIcon } from "../../assets/sendIcon.svg";

function ChatContainer(props) {
    const [message, setMessage] = useState("");

    const handleSendClick = (e) => {
        e.preventDefault();
        if (message.length === 0) return;
        props.sendMessage(message);
        setMessage("");
    }

    const handleTextAreaKeydown = (e) => {
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            handleSendClick(e);
        }
    }

    return (
        <div className="chat-container">
            <MessageList messageList={props.messageList} />
            <form className="send-container" onSubmit={handleSendClick}>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleTextAreaKeydown} />
                <button className="send-button">
                    <SendIcon className="send-icon" />
                </button>
            </form>
        </div>
    );
}

export default ChatContainer;