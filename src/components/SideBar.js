import React from "react";

import '../styles/Sidebar.css'

function MenuElement(props)
{
    return (
        <div className="menu--element">
            <span className="material-symbols-outlined">
                {props.icon}
            </span>
            <p className="menu--element-title" >{props.title}</p>
        </div>
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
            id: 1,
            title: "History", 
            icon: "history"
        },
        {
            id: 2,
            title: "Friends", 
            icon: "group"
        },
        {
            id: 3,
            title: "Chat", 
            icon: "chat"
        }
    ] 

    const menu = menuElement.map(e => 
        <MenuElement
            key={e.id}
            title={e.title} 
            icon={e.icon} 
        />
    )

    return (
        <span className="sidebar">
            <h2 className="sidebar--title" >Menu</h2>
            {menu}
        </span>
    )
}