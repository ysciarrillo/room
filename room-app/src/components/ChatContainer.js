import MessageList from "./MessageList";
import { useState } from 'react';
import './ChatContainer.css';
import { ReactComponent as SendIcon } from '../assets/sendIcon.svg';

function ChatContainer(props) {
    const [message, setMessage] = useState('');

    const handleSendClick = (e) => {
        if (message.length === 0) return;
        props.sendMessage(message);
        setMessage('');
    }

    return (
        <div className='chat-container'>
            <MessageList messageList={props.messageList} />
            <div className='send-container'>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                <button className="send-button" onClick={handleSendClick}>
                    <SendIcon className='send-icon' />
                </button>
            </div>
        </div>
    );
}

export default ChatContainer;