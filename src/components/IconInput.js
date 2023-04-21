
import React from "react";

import './IconInput.css'

export default function IconInput(props)
{
    const [value, setValue] = React.useState("");

    const id = Math.floor(Math.random() * 10000);

    function handleChange(e)
    {
        setValue(e.target.value);
        if (props.getValue)
            props.getValue(e.target.value);
    }

    return (
        <label htmlFor={id} className="iconinput">
            <div className="iconinput--icon">
                <span className="material-symbols-outlined">
                    {props.icon}
                </span>
            </div>
            <input
                id={id} 
                value={value} 
                onChange={handleChange}
                className="inconinput--input" 
                placeholder={props.placeholder}

            />
        </label>
    )
}