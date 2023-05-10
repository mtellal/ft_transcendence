import React from "react";

import MenuElement from "../Chat/MenuElement";
import { Outlet, useOutletContext } from "react-router-dom";
import { getUserFriends } from "../utils/User";

import '../styles/Chat.css'

export default function Chat(props)
{
    const {user} = useOutletContext();
    const [friends, setFriends] = React.useState([])

    async function loadFriends()
    {
        setFriends(await getUserFriends(user.friendList));
    }

    React.useEffect(() => {
        loadFriends();
    }, [])

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
                friends={friends}
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