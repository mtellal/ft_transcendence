import React from "react";

import './LightInput.css'

type TLightInput = {
    placeholder: string,
    value: string,
    setValue: (s: string) => void,
    onClick: () => void,
    maxLength: number,
    onChange?: (e: any) => void
}

export function LightInput(props : TLightInput)
{
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
            props.onClick()
        }
    }

    return (
            <input
                ref={inputRef}
                className="lightinput-container"
                placeholder={props.placeholder}
                value={props.value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
            />
    )
}