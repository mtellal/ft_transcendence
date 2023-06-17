import React from "react";

export default function ResizeContainer({children, ...props} : any)
{
    function style()
    {
        let style : any = {};
        if (props.style)
            style = {...props.style}
        if (props.height)
            style = {...style, height: props.height}
        if (props.width)
            style = {...style, width: props.width}
        return (style)
    }

    return (
        <div className="reset" style={style()} {...props} >
            {children}
        </div>
    )
}