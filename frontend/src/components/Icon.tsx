import React from "react";

import './Icon.css'

type TIcon = {
    icon: string,
    description?: string,
    onClick?: () => {} | any
}

export default function Icon(props: TIcon) {
    return (
        <div className="flex-center icon-container hover-fill-grey" 
            onClick={props.onClick}
        >
                <span className="material-symbols-outlined">
                    {props.icon}
                </span>
            {props.description && <div className="description">{props.description}</div>}
        </div>
    )
}