import React from "react";

import FriendElement from "../components/FriendElement";

import { examplesFriends } from "../exampleDatas";

function FriendList()
{
    const friendsList = examplesFriends.map(e => (
        <FriendElement
            key={e.id}
            id={e.id}
            username={e.username}
            connected={e.connected} 
            chat={true}
        />
    ))

    return (
        <div className="friendlist">
            <h1 className="friends-title" >Friends</h1>
            {
                examplesFriends.length ? 
                    friendsList :
                    <h2>No friends available</h2>
            }
        </div>
    )
}

export default function Friends(props)
{
    return (
        <div className="friends">
            <FriendList />
        </div>
    )
}