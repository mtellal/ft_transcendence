import React, { useEffect, useRef, useState } from "react"

import useUserAccess from "../../../../hooks/Chat/useUserAccess";
import InfoInput from "../../../../components/Input/InfoInput";
import { useChannels } from "../../../../hooks/Chat/useChannels";


export default function ChannelName({ channel }: any) {
    const { isCurrentUserAdmin } = useUserAccess();
    const { updateChannelName } = useChannels();

    const [name, setName]: any = useState("")
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const prevName: any = useRef("");


    useEffect(() => {
        if (channel && channel.name) {
            setName(channel.name);
            prevName.current = channel.name;
        }
    }, [channel, channel.name])

    function submitName() {
        let newName = name && name.trim();
        if (newName) {
            if (newName.length > 15)
                return (setError("Maximum length of 15 letters"));
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
                        />
                    </>
                    :

                    <p>{name}</p>
            }
        </>
    )
}