import React from "react";

import '../styles/Friends.css'

import img from '../images/user.png'

function Friend(props)
{
    return (
        <div className="friend">

            <div className="infos-div" >
                <img className="friend-image" src={img} />
                <div
                    className="firend-icon-status"
                    style={props.connected ? {backgroundColor:"#14CA00"} : null}
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

export default function Friends()
{
    const exampleFriends = [
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
        <Friend username={e.username} connected={e.connected} />
    ))

    return (
        <div className="friends">
            <h1>Friends</h1>
            {friendsList}
        </div>
    )
}
