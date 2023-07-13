import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"

import useUserAccess from "../../../../hooks/Chat/useUserAccess";
import InfoInput from "../../../../components/Input/InfoInput";
import { useChannels } from "../../../../hooks/Chat/useChannels";


export default function ChannelPassword({ channel }: any) {
    const { isCurrentUserAdmin } = useUserAccess(channel);
    const [password, setPassword]: any = useState("")

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { updateChannelPassword } = useChannels();

    function submitName() {
        let newPassword: string = password && password.trim();
        if (newPassword) {
            if (newPassword.length > 15)
                return (setError("Maximum length of 15 letters"));
            setSuccess("Password updated")
            updateChannelPassword(channel.id, newPassword)
        }
    }

    function onChange(e: any) {
        setError("");
        setSuccess("");
    }

    function passwordInformation() {
        if (channel.type === "PROTECTED")
            return (<p>This channel is protected by a password</p>)
        else if (channel.type === "PRIVATE")
            return (<p>This channel is private, no password required</p>)
        else
            return (<p>No password required</p>)
    }

    return (
        <>
            <h2>Password</h2>
            {
                channel.type === "PROTECTED" && isCurrentUserAdmin ?
                    <>
                        {error && <p className="red-c" >{error}</p>}
                        {success && <p className="green-c" >{success}</p>}

                        <InfoInput
                            id="password"
                            label="Set new password "
                            blur={true}
                            value={password}
                            setValue={setPassword}
                            onChange={onChange}
                            submit={() => submitName()}
                        />
                    </>
                    :
                    passwordInformation()
            }
        </>
    )
}