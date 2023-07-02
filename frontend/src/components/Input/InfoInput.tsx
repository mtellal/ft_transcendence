import React from "react";

import './InfoInput.css'

type TInfoInput = {
    id: number | any,
    label: number | any,
    blur?: boolean,
    value: string,
    setValue: (s: string) => {},
    submit?: () => {} | any,
    onChange?: any,
    maxLength?: number
}

export default function InfoInput(props: TInfoInput) {
    const inputRef: any = React.useRef();

    function onChange(e: any) {
        if (e.target.value.length <= (props.maxLength || 200)) {

            props.setValue(e.target.value);
            if (props.onChange)
                props.onChange(e)
        }
    }

    function handleKeyDown(e: any) {
        if (e.key === 'Enter' && props.value) {
            props.submit()
            if (props.blur)
                inputRef.current.blur();
        }
    }

    return (
        <div className="flex-column fill">
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