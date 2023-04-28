import React from "react";

import MenuElement from "../components/Chat/MenuElement";
import { Outlet } from "react-router-dom";

import '../styles/Chat.css'

export default function Chat(props)
{

    function addFriend()
    {
        console.log("addFriend");
    }

    function addGroup()
    {
        console.log("add group");
    }

    function getElement(p)
    {
        console.log("get Element")
    }

    return (
        <div className="chat">
            <div className="chat-container">
               <MenuElement
                user={props.user}
                addFriend={() => addFriend()}
                addGroup={() => addGroup()}
                getElement={getElement}
               />
                <Outlet />
            </div>
        </div>
    )
}