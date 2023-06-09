import React from "react";


export default function ResizeContainer({children, ...props} : any)
{
    function style()
    {
        let style = {};
        if (props.height)
            style = {height: props.height}
        if (props.width)
            style = {...style, width: props.width}
        return (style)
    }

    return (
        <div style={style()}>
            {children}
        </div>
    )
}