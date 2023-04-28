import React from "react";

import FriendElement from "../components/FriendElement";


function FriendList()
{

    return (
        <div className="friendlist">
            <h1 className="friends-title" >Friends</h1>
            {
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