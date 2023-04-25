import React from "react";

import '../styles/Chat.css'

import { examplesFriends, examplesGroup, exampleMessages } from "../exampleDatas";

import MessagesElement from "../components/Chat/MessagesElement";
import MenuElement from "../components/Chat/MenuElement";
import AddElement from "../components/Chat/AddElement";
import { Outlet } from "react-router-dom";


export default function Chat()
{
    const [newFriend, setNewFriend] = React.useState(false);
    const [newGroup, setNewGroup] = React.useState(false);
    const [messagesDisplay, setMessagesDisplay] = React.useState(true);
    const [item, setItem] = React.useState(null);

    function addFriend()
    {
        console.log("addFriend");
        setMessagesDisplay(false)
        setNewFriend(true);
        setNewGroup(false)
    }

    function addGroup()
    {
        console.log("add group");
        setMessagesDisplay(prev => false)
        setNewGroup(true)
        setNewFriend(false)
    }

    function getElement(p)
    {
        if (p.username)
            setItem(examplesFriends[p.id])
        else if (p.name)
            setItem(exampleMessages[p.id])
        setNewFriend(false);
        setNewGroup(false);
        setMessagesDisplay(true);
    }

    return (
        <div className="chat">
            <div className="chat-container">
               <MenuElement
                addFriend={() => addFriend()}
                addGroup={() => addGroup()}
                getElement={getElement}
               />
                { messagesDisplay &&  <MessagesElement item={item} /> }
                <Outlet />
            </div>
        </div>
    )
}