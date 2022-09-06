import './ParticipantList.css';
import Participant from './Participant';

function ParticipantList(props) {
    return (
        <div className='participant-list'>
            <ul>
                <Participant key={props.me.id} participant={props.me} isMe={true} updateStatus={props.updateStatus} />

                {
                    props.participantList.filter((p) => p.id !== props.me.id).map((p) =>
                        <Participant key={p.id} participant={p} isMe={false} />
                    )
                }
            </ul>
        </div>
    )
}

export default ParticipantList;