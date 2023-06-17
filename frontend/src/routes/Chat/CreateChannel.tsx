import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useChannelsContext, useCurrentUser } from "../../hooks/Hooks";
import InfoInput from "../../components/Input/InfoInput";
import { createChannel } from "../../requests/chat";
import UsersCollection from "../../components/collections/UsersCollection";
import PickMenu from "../../components/PickMenu";

import ArrowBackMenu from "./components/ArrowBackMenu";
import { useChannels } from "../../hooks/Chat/useChannels";


export function CreateChannel() {

    const [name, setName]: [string, any] = useState("");
    const [type, setType]: [string, any] = useState("public")
    const [password, setPassword]: [string, any] = useState("");

    const [error, setError] = useState("");

    const { token } = useCurrentUser();

    const { setCurrentChannel } = useChannelsContext();

    const { addChannel } = useChannels();

    const navigate = useNavigate();

    async function submit() {
        if (!type)
            return (setError("Access required"))

        if (!name.trim() || name.trim().match(/[^a-zA-Z0-9 ]/g) || name.length > 15)
            return setError("Name incorrect, (alphanumeric - 15 chars max)");
        if (type === "protected") {
            if (!password.trim())
                return setError("Password required");
            if (password.trim().length > 15)
                return setError("Password too long (15 chars max)")
        }


        let channel: any;
        await createChannel({
            name: name.trim(),
            type: type.toUpperCase(),
            password,
        }, token)
            .then(res => {
                if (res.data) {
                    channel = res.data;
                    addChannel(res.data, false)
                    setCurrentChannel(res.data);
                }
            })
        if (channel)
            navigate(`/chat/channel/${channel.id}`)
        else
            navigate('/chat')
    }

    return (
        <div className="scroll"
            style={{padding: '5%'}}
        >
            <div className="flex">
                <ArrowBackMenu
                    title="Channel"
                    path="/chat"
                />
            </div>
            <h2>Create a channel</h2>
            <InfoInput
                id="name"
                label="Name"
                value={name}
                setValue={setName}
                submit={() => { }}
            />
            {
                type === "protected" &&
                <InfoInput
                    id="password"
                    label="Password"
                    value={password}
                    setValue={setPassword}
                    submit={() => { }}
                />
            }
            <div style={{ paddingBottom: '20px' }}>

                <h2>Access</h2>
                <PickMenu
                    title="Visibility"
                    collection={["public", "protected", "private"]}
                    selected={type}
                    setSelected={setType}
                />
            </div>
            {error && <p className="red-c" >{error}</p>}
            <button
                className="button white"
                style={{ width: '100px', height: '40px', fontSize: 'medium' }}
                onClick={() => submit()}
            >
                Create
            </button>
        </div>
    )
}