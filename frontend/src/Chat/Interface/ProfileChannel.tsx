import React, { useEffect } from "react";

import IconInput from "../../Components/IconInput";

import './ProfileChannel.css'


export default function ProfileGroup({user, channel, ...props} : any)
{
    const administrators = channel.administrators.map((m : any) => <p>{m}</p>)
    const members = channel.members.map((m : any) => <p>{m}</p>)
    const banned = channel.banMembers.map((m : any) => <p>{m}</p>)

    function accessPassword()
    {
        return (channel.administrators.find((m : any) => m === user.username))
    }

    return (
        <div className="flex-column settings">
            <h2>Settings</h2>
            {
                accessPassword() && 
                <div className="password">
                    <IconInput 
                        icon="lock"
                        placeholder="password"
                    />
                    <button className="button">Save</button>
                </div>
            }
            <div className="ban">
                <h3>Owner</h3>
                <p>{channel.owner}</p>
            </div>
            <div className="ban">
                <h3>Administrators</h3>
                {administrators}
            </div>
            <div className="ban">
                <h3>Members</h3>
                <p>{members}</p>
            </div>
            <div className="ban">
                <h3>Banned members</h3>
                {banned}
            </div>
        </div>
    )
}