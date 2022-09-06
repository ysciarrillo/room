import Avatar from "avataaars";
import { generateRandomAvatarOptions } from "../../avatar";
import { useEffect, useState } from "react";
import "./Participant.css";

function Participant(props) {
    const [avatarOptions, setAvatarOptions] = useState();
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState();

    useEffect(() => {
        setAvatarOptions(generateRandomAvatarOptions());
    }, []);

    useEffect(() => {
        setNewStatus(props.participant.status);
    }, [props]);

    const handleNewStatus = () => {
        if (isEditingStatus && newStatus !== props.participant.status) {
            setNewStatus(newStatus);
            props.updateStatus(newStatus);
        }

        setIsEditingStatus((prevValue) => !prevValue);
    }

    return (
        <li key={props.participant.id}>
            <Avatar
                avatarStyle="Square"
                {...avatarOptions}
                style={{ width: "50px", height: "50px" }}
            />
            <div className="participant-info">
                <span>{props.participant.name} {props.isMe && "(You)"}</span>
                <div className="status">
                    {isEditingStatus && props.isMe
                        ? <input className="edited-status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)} />
                        : <span className="status-text">{props.participant.status.length === 0 ? "No status yet..." : props.participant.status}</span>
                    }
                    {props.isMe &&
                        <button className="icon-button" onClick={handleNewStatus}>
                            {isEditingStatus
                                ? <span>&#10004;</span>
                                : <span>&#9998;</span>
                            }
                        </button>
                    }
                </div>

            </div>
        </li>

    )
}

export default Participant;