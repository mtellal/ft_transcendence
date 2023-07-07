import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useChannelsContext, useCurrentUser } from "../../hooks/Hooks";
import InfoInput from "../../components/Input/InfoInput";
import { createChannel } from "../../requests/chat";
import PickMenu from "../../components/PickMenu";

import ArrowBackMenu from "./components/ArrowBackMenu";
import { useChannels } from "../../hooks/Chat/useChannels";


export function CreateChannel() {

    const navigate = useNavigate();
    const { token } = useCurrentUser();
    const { addChannel } = useChannels();
    const { setCurrentChannel } = useChannelsContext();


    const [name, setName]: [string, any] = useState("");
    const [type, setType]: [string, any] = useState("public")
    const [password, setPassword]: [string, any] = useState("");

    const [error, setError] = useState("");


    async function submit() {
        if (!type)
            return (setError("Access required"))

        if (!name.trim() || name.trim().match(/[^a-zA-Z0-9 ]/g) || name.length > 20)
            return setError("Name incorrect, (alphanumeric - 20 chars max)");
        if (type === "protected") {
            if (!password.trim())
                return setError("Password required");
            if (password.trim().length > 30)
                return setError("Password too long (30 chars max)")
        }


        let channel: any;
        await createChannel({
            name: name.trim(),
            type: type.toUpperCase(),
            password,
        }, token)
            .then(res => {
                console.log(res);
                if (res.data) {
                    channel = res.data;
                    addChannel(res.data, false)
                    setCurrentChannel(res.data);
                }
            })
        console.log("Channel created => ", channel)
        if (channel)
            navigate(`/chat/channel/${channel.id}`)
        else
            navigate('/chat')
    }

    return (
        <div className="scroll flex-column"
            style={{ padding: '5%', flex: 3 }}
        >
            {/* <div className="flex">
                <ArrowBackMenu
                    title="Channel"
                    path="/chat"
                />
            </div> */}
            <h2>Create a channel</h2>
            <div>
                <InfoInput
                    id="name"
                    label="Name"
                    value={name}
                    setValue={setName}
                    submit={() => { }}
                    maxLength={20}
                />
            </div>
            {
                type === "protected" &&
                <InfoInput
                    id="password"
                    label="Password"
                    value={password}
                    setValue={setPassword}
                    submit={() => { }}
                    maxLength={30}
                />
            }
            <div style={{ paddingBottom: '20px' }}>

                <h3>Access</h3>
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