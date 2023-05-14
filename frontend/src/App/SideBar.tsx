import React from "react";

import './Sidebar.css'
import { Link, NavLink } from "react-router-dom";

function MenuElement(props)
{
    return (
        <NavLink 
            to={props.route} 
            className={({isActive}) => isActive ? "menu--element selected" : "menu--element"}
        >
            <span className="material-symbols-outlined">
                {props.icon}
            </span>
            <p className="menu--element-title" >{props.title}</p>
        </NavLink>
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
        <span className="flex-column sidebar">
            <h2 className="sidebar--title" >Menu</h2>
            {menu}
        </span>
    )
}