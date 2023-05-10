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
        const friendsRes = await getUserFriends(user.friendList); 
        setFriends(friendsRes.map(res => {
            if (res.status === 200 && res.statusText === "OK")
                return (res.data)
            else
                console.log("Menu element, res => ", res) 
        }))
    }

    React.useEffect(() => {
        loadFriends();
        const loadFriendsInterval = setInterval(loadFriends, 3000)
        return (() => clearInterval(loadFriendsInterval))
    }, [])

    function updateFriendList()
    {
        console.log("function called from outlet")
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
                addGroup={() => addGroup()}
                getElement={getElement}
               />
                <Outlet context={{user, updateFriendList}} />
            </div>
        </div>
    )
}