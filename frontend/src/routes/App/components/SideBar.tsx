import React, { useState } from "react";

import './Sidebar.css'
import { Link, NavLink } from "react-router-dom";
import PickMenu from "../../../components/PickMenu";
import { useWindow } from "../../../hooks/useWindow";

function MenuElement(props: any) {
    return (
        <NavLink
            to={props.route}
            className={({ isActive }) => isActive ? "menu--element selected" : "menu--element"}
        >
            <span className="material-symbols-outlined">
                {props.icon}
            </span>
            <p className="menu--element-title" >{props.title}</p>
        </NavLink>
    )
}


function PickSideBar(props: any) {
    const [show, setShow] = useState(false);

    return (
        <div className="fill">
            <div className="flex-column" onClick={() => setShow(p => !p)}>
                {
                    <div className="picksidebar-option">
                        <p>{props.selected || "Menu ..."}</p>
                    </div>
                }
                {
                    show && props.collection && props.collection.length &&
                    props.collection.map((option: any) =>
                        <div
                            key={option.props.title}
                            className="picksidebar-option hover-gray"
                            style={{ borderTop: '0' }}
                            onClick={() => props.setSelected(option.props.title)}
                        >
                            {option}
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default function Sidebar() {
    const [selected, setSelected] = useState("Game");
    const { isMobileDisplay } = useWindow();

    const menuElement = [
        {
            id: 0,
            title: "Profile",
            icon: "account_circle"
        },
        {
            id: 2,
            title: "Game",
            icon: "sports_esports"
        },
        {
            id: 3,
            title: "History",
            icon: "history"
        },
        {
            id: 4,
            title: "Chat",
            icon: "chat"
        }
    ]

    const menu = menuElement.map(e =>
        <MenuElement
            key={e.id}
            title={e.title}
            icon={e.icon}
            route={`/${e.title.toLocaleLowerCase()}`}
        />
    )

    return (
        <span className="flex-column sidebar">
            <h2 className="sidebar--title" >Menu</h2>
            {
                isMobileDisplay ?
                    <PickSideBar
                        collection={menu}
                        selected={selected}
                        setSelected={setSelected}
                    />
                    :
                    menu
            }
        </span>
    )
}