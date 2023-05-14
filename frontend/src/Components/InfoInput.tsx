import React from "react";

import './InfoInput.css'

export default function InfoInput(props) {
    const inputRef = React.useRef();
    const [value, setValue] = React.useState(props.value || "");

    function onChange(e) {
        setValue(e.target.value);
        if (e.target.value) {
            props.getValue(e.target.value);
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && value) {
            props.submit()
            inputRef.current.blur();
        }
    }

    return (
        <div className="flex-column infoinput-container">
            <label htmlFor={props.id} className="infoinput-label" >{props.label}</label>
            <input
                ref={inputRef}
                id={props.id}
                className="infoinput-input"
                placeholder={props.label}
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    )
}