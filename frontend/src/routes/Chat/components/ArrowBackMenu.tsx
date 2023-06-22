import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Icon from "../../../components/Icon";

type TArrowBackMenu = {
    path?: string, 
    title?: string
}

export default function ArrowBackMenu(props: TArrowBackMenu) {
    return (
        <>
            <Link to={props.path ? props.path : "/chat"}
                className="flex-center decoration-none black-c"
                style={{ padding: '0 10px 0 5px' }}
            >
                <Icon
                    icon="arrow_back"
                    description="friends"
                />
                {props.title && <h2>{props.title}</h2>}
            </Link>
        </>
    )
}