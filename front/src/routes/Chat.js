import React, { useEffect } from "react";

import '../styles/Chat.css'

import { examplesFriends, examplesGroup, exampleMessages } from "../exampleDatas";

import Interface from "../components/Chat/Interface/Interface";
import MenuElement from "../components/Chat/MenuElement";
import AddElement from "../components/Chat/Interface/AddElement";
import { Outlet, useRevalidator } from "react-router-dom";


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