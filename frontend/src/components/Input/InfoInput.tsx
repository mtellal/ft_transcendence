import React from "react";

import './InfoInput.css'

type TInfoInput = {
    id: number | any,
    label: number | any,
    value: string,
    setValue: (s : string) => {},
    submit?: () => {}
}

export default function InfoInput(props: TInfoInput) {
    const inputRef: any = React.useRef();

    function onChange(e: any) {
        props.setValue(e.target.value);
    }

    function handleKeyDown(e: any) {
        if (e.key === 'Enter' && props.value) {
            props.submit()
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
                value={props.value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    )
}