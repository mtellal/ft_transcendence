import React, { useEffect } from "react";

import '../styles/Chat.css'

import { examplesFriends, examplesGroup, exampleMessages } from "../exampleDatas";

import MessagesElement from "../components/Chat/MessagesElement";
import MenuElement from "../components/Chat/MenuElement";
import AddElement from "../components/Chat/AddElement";
import { Outlet, useRevalidator } from "react-router-dom";


export default function Chat(props)
{
    const [messagesDisplay, setMessagesDisplay] = React.useState(true);
    const [item, setItem] = React.useState(null);

    function addFriend()
    {
        console.log("addFriend");
        setMessagesDisplay(false)
    }

    function addGroup()
    {
        console.log("add group");
        setMessagesDisplay(false)
    }

    function getElement(p)
    {
        if (p.username && props.user.friendList)
            setItem(props.user.friendList[p.id])
        else if (p.name)
            setItem(exampleMessages[p.id])
        setMessagesDisplay(true);
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
                { messagesDisplay && <MessagesElement  user={props.user} item={item} /> }
                <Outlet />
            </div>
        </div>
    )
}