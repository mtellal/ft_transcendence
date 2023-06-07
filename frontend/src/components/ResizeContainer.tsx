import React from "react";


export default function ResizeContainer({children, ...props} : any)
{
    return (
        <div style={{height: props.height}}>
            {children}
        </div>
    )
}