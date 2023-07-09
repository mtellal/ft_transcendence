import React, { useCallback, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "../../../../hooks/Hooks";
import { useChannels } from "../../../../hooks/Chat/useChannels";

import { getChannelProtected } from "../../../../requests/chat";
import InfoInput from "../../../../components/Input/InfoInput";
import { ChatInterfaceContext } from "../../Chat/Chat";
import { ConfirmViewButtons } from "../../Profile/ChannelProfile/ConfirmAction";
import { SearchedChannelLabelContext } from "../../Menu/SearchElement";

import ownerIcon from '../../../../assets/House.svg';
import adminIcon from '../../../../assets/ShieldCheck.svg';


import './ChannelSearchLabel.css'
import { Channel } from "../../../../types";

type TProtectedChannelPassword = {
    reset: any,
    channel: Channel
}

function ProtectedChannelPassword(props: TProtectedChannelPassword) {

    const { token } = useCurrentUser();
    const [passwordValue, setPasswordValue]: any = useState("");
    const { addChannelProtected } = useChannels();
    const [error, setError] = useState("")

    const { setAction } = useContext(ChatInterfaceContext)


    async function submitPassword() {

        if (passwordValue.trim()) {
            await getChannelProtected(props.channel.id, passwordValue.trim(), token)
                .then(res => {
                    if (res.data) {
                        addChannelProtected(props.channel, passwordValue, true);
                        setError("");
                        setAction(null);
                        props.reset();
                    }
                    else
                        setError("Wrong password")
                })
        }
    }

    return (
        <div className="join-protectedchannel flex-column red">
            <h3 className="reset">Channel protected</h3>
            <p>This channel require a password</p>
            {error && <p className="red-c">{error}</p>}
            <InfoInput
                id="joinchannel-confirmview"
                label="Password"
                value={passwordValue}
                setValue={setPasswordValue}
                submit={() => submitPassword()}
            />
            <ConfirmViewButtons
                valid={() => submitPassword()}
                cancel={() => setAction(null)}
            />
        </div>
    )
}

