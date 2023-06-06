import React from "react";
import Icon from "./Icon";

export default function Title({children, ...props}: any) {
    return (
        <div className="flex">
            <h2>{props.title}</h2>
            {
                props.icon &&
                < Icon
                    icon={props.icon}
                    description={props.iconDescription}
                    onClick={props.onClick}
                />
            }
            {children}
        </div>
    )
}