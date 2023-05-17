
import React from "react";

import './IconInput.css'

/*
    PROPS:
    - icon (left icon check google icon to respect the format https://fonts.google.com/icons )
    - placeholder
    - getValue() up to parent component the current value in input with props.getValue()
    - submit() exex function props.submit when enter is pressed
*/

export default function IconInput(props : any)
{
    const [value, setValue] = React.useState("");

    const id = Math.floor(Math.random() * 10000);

    function handleChange(e : any)
    {
        setValue(e.target.value);
        if (props.getValue && value !== "")
            props.getValue(e.target.value);
    }

    function onKeyDown(e : any)
    {
        if (e.key === 'Enter')
        {
            console.log("Enter pressed");
            props.submit(e);
        }
    }

    return (
        <label htmlFor={id.toString()} className="iconinput" style={props.style || null}>
            <div className="iconinput--icon">
                <span className="material-symbols-outlined">
                    {props.icon}
                </span>
            </div>
            <input
                id={id.toString()} 
                value={value} 
                onChange={handleChange}
                className="inconinput--input" 
                placeholder={props.placeholder}
                onKeyDown={onKeyDown}
            />
        </label>
    )
}