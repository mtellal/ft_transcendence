import React, { useEffect, useRef, useState } from "react"

import useUserAccess from "../../../../hooks/Chat/useUserAccess";
import InfoInput from "../../../../components/Input/InfoInput";
import { useChannels } from "../../../../hooks/Chat/useChannels";


export default function ChannelName({ channel }: any) {
    const { isCurrentUserAdmin } = useUserAccess(channel);
    const { updateChannelName } = useChannels();

    const [name, setName]: any = useState(channel.name)
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const prevName: any = useRef("");

    prevName.current = channel.name;


    function submitName() {
        let newName = name && name.trim();
        if (newName) {
            if (newName === prevName.current)
                return;
            prevName.current = newName;
            setSuccess("Name updated")
            updateChannelName(channel.id, newName)
        }
    }

    function onChange() {
        setError("");
        setSuccess("");
    }

    return (
        <>
            <h2>Name</h2>
            {
                isCurrentUserAdmin ?
                    <>
                        {error && <p className="red-c " >{error}</p>}
                        {success && <p className="green-c " >{success}</p>}
                        <InfoInput
                            id="name"
                            label="Channel name"
                            blur={true}
                            value={name}
                            setValue={setName}
                            onChange={onChange}
                            submit={() => submitName()}
                            maxLength={20}
                        />
                    </>
                    :
                    <p>{name}</p>
            }
        </>
    )
}