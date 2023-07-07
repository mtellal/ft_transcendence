import React, { useState } from "react";

import check from '../assets/Check.svg'

import './Icon.css'

type TIcon = {
    icon: any,
    description?: string,
    onClick?: () => {} | any,
    hoverColor?: string,
}

export default function Icon(props: TIcon) {

    const [hover, setHover] = useState(false);

    return (
        <div className="flex-center icon-container hover-fill-grey pointer"
            onClick={props.onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={props.hoverColor && hover ? {backgroundColor: props.hoverColor} : {} }
        >
            <img src={props.icon} alt={props.description} />
            {props.description && <div className="description">{props.description}</div>}
        </div>
    )
}

export function CheckedIcon(props: TIcon) {
    const [checked, setChecked] = useState(false);
    return (
        <div className={checked ? "flex-center icon-container" : "flex-center icon-container pointer hover-fill-grey"}
            onClick={() => {!checked && props.onClick(); setChecked(true)}}
        >
            {
                checked ? 
                <img src={check} alt="checked" /> :
                <img src={props.icon} alt={props.icon} />
            }
            {props.description && !checked && <div className="description">{props.description}</div>}
        </div>
    )
}


export function RawIcon({ icon }: any) {
    return (
        <span className="material-symbols-outlined">
            {icon}
        </span>
    )
}