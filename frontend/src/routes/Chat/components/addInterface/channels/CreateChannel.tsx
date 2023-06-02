import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useChannels, useChatSocket, useFriends, useCurrentUser } from "../../../../../Hooks";
import InfoInput from "../../../../../components/Input/InfoInput";
import { createChannel } from "../../../../../utils/User";
import UsersCollection from "../../../../../components/UsersCollection";
import PickMenu from "../../../../../components/PickMenu";

import './CreateChannel.css'


export function CreateChannel() {

    const [name, setName]: [string, any] = useState("");
    const [type, setType]: [string, any] = useState("")
    const [password, setPassword]: [string, any] = useState("");
    const [admins, setAdmins] = useState([]);
    const [members, setMembers] = useState([]);
    const [banMembers, setBanMembers] = useState([]);

    const { token } = useCurrentUser();

    const {channels, channelsDispatch, setCurrentChannel, addChannel} = useChannels();

    const navigate = useNavigate();

    async function submit() {
        if (!name || !type)
            return;

        await createChannel({
            name,
            type: type.toUpperCase(),
            password,
            administrators: admins.map((u: any) => u.id),
            members: members.map((u: any) => u.id),
            banList: banMembers.map((u: any) => u.id),
        }, token)
            .then(res => {
                //channelsDispatch({ type: 'addChannel', channel: res.data })
                addChannel(res.data)
                console.log("CREATED: current channel setted to ", res.data)
                setCurrentChannel(res.data);
                //joinChannel(res.data);
            })
        console.log("channelCreated")
        navigate(`/chat/groups/${name}`)
    }


    return (
        <div className="add-container scroll">
            <h2>Create a channel</h2>
            <InfoInput
                id="name"
                label="Name"
                value={name}
                setValue={setName}
                submit={null}
            />
            <InfoInput
                id="password"
                label="Password"
                value={password}
                setValue={setPassword}
                submit={null}
            />
            <PickMenu
                title="Visibility"
                collection={["public", "protected", "private"]}
                selected={type}
                setSelected={setType}
            />
            <UsersCollection
                title="Admins"
                users={admins}
                setUsers={setAdmins}
            />
            <UsersCollection
                title="Members"
                users={members}
                setUsers={setMembers}
            />
            <UsersCollection
                title="Banned Members"
                users={banMembers}
                setUsers={setBanMembers}
            />
            <button className="button" onClick={() => submit()}>
                Create
            </button>
        </div>
    )
}