import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './Home.css';

function Home() {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState("");
    const [showError, setShowError] = useState(false);

    const handleCreateRoom = () => {
        let newRoomId = uuidv4();
        console.log("create clicked", newRoomId);
        navigate(`/room/${newRoomId}`);
    }

    const handleJoinRoom = () => {
        if (roomId.length === 0) {
            setShowError(true);
            return;
        }

        setShowError(false);
        console.log("join clicked", roomId);
        navigate(`/room/${roomId}`);
    }

    return (
        <div className='btn-container'>
            <button className='button-cta' onClick={handleCreateRoom}>Create room</button>
            <span>OR</span>
            <span>Enter room ID below</span>
            <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
            {showError && <span className='error'>Room ID is required!</span>}
            <button className='button-cta' onClick={handleJoinRoom}>Join room</button>
        </div>
    );
}

export default Home;