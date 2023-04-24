
import React from "react";

import './AddElement.css'

export default function AddElement(props)
{
    const [value, setValue] = React.useState("");

    function handleChange(e)
    {
        setValue(e.target.value);
    }

    function handleKeys(e)
    {
        if (e.key === "Enter")
        {
            console.log(`Search '${props.title.toLowerCase()}'`)
            setValue("")
        }

    }

    return (
        <div className="add-container">
            <div className="add-div">
                <h2 className="add-title">{props.title}</h2>
                <label htmlFor="input" className="search-input">
                    <span className="material-symbols-outlined">
                        search
                    </span>
                <input
                    id="input"
                    className="add-input"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeys}
                    />
                </label>
            </div>
        </div>
    )
}
