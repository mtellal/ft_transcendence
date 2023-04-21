import React from "react";

import '../styles/Friends.css'

import img from '../images/user.png'

function FriendElement(props)
{
    return (
        <div className="friend">

            <div className="infos-div" >
                <img className="friend-image" src={img} />
                <div
                    className="firend-icon-status"
                    style={props.connected ? {backgroundColor:"#14CA00"} : {backgroundColor:"red"} }
                />
                <div className="friend-infos">
                    <p className="username" >{props.username}</p>
                    <p className="friend-status">
                        {props.connected ? "On line" : "Disconnected" }
                    </p>
                </div>
            </div>

            <div className="friend-actions">
                <span class="material-symbols-outlined">
                    mode_comment
                </span>
            </div>

        </div>
    )
}

function FriendList()
{
    const exampleFriends = [
        {
            username: "plawdfwfwfwfwfwfdfwfwyer",
            connected: false
        },
        {
            username: "wdf",
            connected: false
        },
        {
            username: "player",
            connected: true
        },
        {
            username: "player",
            connected: false
        },
        {
            username: "player",
            connected: false
        },
        {
            username: "player",
            connected: false
        },
        {
            username: "wdf",
            connected: false
        },
        {
            username: "player",
            connected: true
        },
        {
            username: "player",
            connected: false
        },
        {
            username: "player",
            connected: false
        },
        {
            username: "player",
            connected: false
        },
        {
            username: "wdf",
            connected: false
        },
        {
            username: "player",
            connected: true
        },
        {
            username: "player",
            connected: false
        },
        {
            username: "player",
            connected: false
        },
    ]

    const friendsList = exampleFriends.map(e => (
        <FriendElement username={e.username} connected={e.connected} />
    ))

    return (
        <div className="friendlist">
            <h1>Friends</h1>
            {friendsList}
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