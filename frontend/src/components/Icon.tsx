import React from "react";

import './Icon.css'

export default function Icon(props: any) {
    return (
        <div className="flex-center banner-icon hover-fill-grey" 
            onClick={props.onClick}
        >
                <span className="material-symbols-outlined">
                    {props.icon}
                </span>
            {props.description && <div className="description">{props.description}</div>}
        </div>
    )
}