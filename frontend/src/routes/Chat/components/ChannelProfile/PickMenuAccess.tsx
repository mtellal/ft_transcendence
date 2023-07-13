import React, { useEffect, useRef, useState } from "react"

import useUserAccess from "../../../../hooks/Chat/useUserAccess";
import PickMenu from "../../../../components/PickMenu";
import { useChannels } from "../../../../hooks/Chat/useChannels";

export default function PickMenuAccess({ channel, protectedAccess }: any) {
    const { isCurrentUserAdmin } = useUserAccess(channel);
    const { updateChannelType } = useChannels();

    const [success, setSuccess] = useState("");
    const [type, setType] = useState("")
    const prevType = useRef("");

    useEffect(() => {
        if (channel && channel.type) {
            setType(channel.type.toLowerCase());
            prevType.current = channel.type.toLowerCase();
        }
    }, [channel, channel.type])

    function select(element: any) {
        if (prevType.current !== element) {
            if (element === "protected")
                protectedAccess()
            else {
                prevType.current = element;
                setSuccess("Access updated")
                updateChannelType(channel.id, element.toUpperCase());
                setType(element);
            }
        }
    }

    return (
        <>
            <h2>Access</h2>
            {success && <p className="green-c">{success}</p>}
            {
                isCurrentUserAdmin ?
                    <PickMenu
                        title="Access"
                        collection={["public", "protected", "private"]}
                        selected={type}
                        setSelected={select}
                        picking={() => { setSuccess("") }}
                    />
                    :
                    <p>{type}</p>
            }
        </>
    )
}
