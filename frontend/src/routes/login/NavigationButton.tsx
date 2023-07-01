import React from "react";
import { Link } from "react-router-dom";

type TNavigationButton = {
    mainTitle: string, 
    secondTitle: string, 
    onClick: any, 
    path: string
}


export function NavigationButton(props: TNavigationButton) {
    return (
        <div className="flex-column-center" style={{width: '100%', bottom: '10px'}}>
            <button
                className="sign--button"
                onClick={props.onClick}
            >
                {props.mainTitle}
            </button>
            <Link
                to={props.path}
                className="sign--link"
            >
                {props.secondTitle}
            </Link>
        </div>
    )
}