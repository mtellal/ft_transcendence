import React, { useState } from "react";

import check from '../assets/Check.svg'

import './Icon.css'

type TIcon = {
    icon: any,
    description?: string,
    onClick?: () => {} | any,
}

export default function Icon(props: TIcon) {

    return (
        <div className="icon-container pointer"
            onClick={props.onClick}
        >
            <img src={props.icon} alt={props.description} />
            {props.description && <div className="icon-description">{props.description}</div>}
        </div>
    )
}

export function CheckedIcon(props: TIcon) {
    const [checked, setChecked] = useState(false);
    return (
        <div className={checked ? "icon-container icon-checked" : "icon-container pointer"}
            onClick={() => {!checked && props.onClick(); setChecked(true)}}
        >
            {
                checked ? 
                <img src={check} alt="checked" /> :
                <img src={props.icon} alt={props.icon} />
            }
            {props.description && !checked && <div className="icon-description">{props.description}</div>}
        </div>
    )
}
