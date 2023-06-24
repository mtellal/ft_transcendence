
import React from "react";

import './IconInput.css'

type TIconInput = {
    id: number | any,
    placeholder?: string,
    icon: string,
    value: string,
    style?: {} | any,
    setValue: (s: string) => {} | any,
    submit?: () => {} | any,
    maxLength: number,
}

export default function IconInput(props: TIconInput) {
    function handleChange(e: any) {
        if (e.target.value.length <= props.maxLength)
        {
            props.setValue(e.target.value);
        }
    }

    function onKeyDown(e: any) {
        if (e.key === 'Enter') {
            props.submit();
        }
    }

    return (
        <label htmlFor={props.id} className="iconinput" style={props.style || null}>
            <div className="iconinput--icon">
                <span className="material-symbols-outlined">
                    {props.icon}
                </span>
            </div>
            <input
                id={props.id}
                value={props.value}
                onChange={handleChange}
                className="inconinput--input"
                placeholder={props.placeholder}
                onKeyDown={onKeyDown}
            />
        </label>
    )
}
