import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Icon from "../../../components/Icon";


export default function ArrowBackMenu(props: any) {
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