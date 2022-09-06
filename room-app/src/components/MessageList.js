import './MessageList.css';
import { useRef, useEffect } from 'react';

function MessageList(props) {
    const divRef = useRef(null);

    const scrollToBottom = () => {
        const scrollHeight = divRef.scrollHeight;
        const height = divRef.clientHeight;
        const maxScrollTop = scrollHeight - height;
        divRef.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }

    useEffect(() => {
        console.log('scroll');
        divRef.current.scrollIntoView({ behavior: 'smooth' });
        scrollToBottom();
    }, []);

    return (
        <div ref={divRef} className='message-list'>
            {
                props.messageList.map((m) =>
                    <span className="message" key={m.id}>{m.text}</span>
                )
            }
        </div>
    );
}

export default MessageList;