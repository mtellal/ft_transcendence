import React from "react";

import './Sidebar.css'
import { Link } from "react-router-dom";

function MenuElement(props)
{
    return (
        <Link to={props.route} className="menu--element">
            <span className="material-symbols-outlined">
                {props.icon}
            </span>
            <p className="menu--element-title" >{props.title}</p>
        </Link>
    )
}

export default function Sidebar()
{

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
        <span className="sidebar">
            <h2 className="sidebar--title" >Menu</h2>
            {menu}
        </span>
    )
}