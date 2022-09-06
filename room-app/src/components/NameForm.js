import { useState } from "react";
import './NameForm.css';

function NameForm(props) {
    const [name, setName] = useState('');

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        props.handleName(name);
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <label htmlFor='name'>Enter your name to proceed</label>
            <input id='name' value={name} onChange={handleNameChange} />
            <button className='button-cta'>Continue</button>
        </form>
    );
}

export default NameForm;