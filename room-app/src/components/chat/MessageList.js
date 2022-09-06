import "./MessageList.css";
import { useRef, useEffect } from "react";

function MessageList(props) {
    const bottom = useRef(null)

    const scrollToBottom = () => {
        bottom.current.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom();
    }, [props.messageList]);

    return (
        <div className="message-list">
            {
                props.messageList.map((m) =>
                    <div key={m.id} className="message">
                        <span className="sender-name">{m.senderName}</span>
                        <span className="message-text">{m.text}</span>
                    </div>
                )
            }
            <div ref={bottom}></div>
        </div>
    );
}

export default MessageList;