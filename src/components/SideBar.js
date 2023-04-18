import React from "react";

import '../styles/Sidebar.css'

function MenuElement(props)
{
    return (
        <div className="menu--element">
            <span class="material-symbols-outlined">
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
            title: "Profile", 
            icon: "account_circle"
        },
        {
            title: "History", 
            icon: "history"
        },
        {
            title: "Friends", 
            icon: "group"
        },
        {
            title: "Chat", 
            icon: "chat"
        }
    ] 

    const menu = menuElement.map(e => <MenuElement title={e.title} icon={e.icon} />)

    return (
        <span className="sidebar">
            <h2 className="sidebar--title" >Menu</h2>
            {menu}
        </span>
    )
}