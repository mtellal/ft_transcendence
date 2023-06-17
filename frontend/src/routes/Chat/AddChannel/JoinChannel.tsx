
import React, { useCallback, useEffect, useState } from "react";

import { getChannelByName, getChannelProtected } from '../../../requests/chat'

import {
    getUser,
    getUserProfilePictrue,

} from '../../../requests/user'


import IconInput from "../../../components/Input/IconInput";

import { useChannelsContext, useChatSocket, useFriendsContext, useCurrentUser } from "../../../hooks/Hooks";
import ProfilePicture from "../../../components/users/ProfilePicture";
import Icon, { RawIcon } from "../../../components/Icon";

import defaultUserPP from '../../../assets/user.png'

import './JoinChannel.css'
import { useWindow } from "../../../hooks/useWindow";
import ArrowBackMenu from "../components/ArrowBackMenu";
import useBanUser from "../../../hooks/Chat/useBanUser";
import ResizeContainer from "../../../components/ResizeContainer";
import useChannelAccess from "../../../hooks/Chat/useChannelAccess";
import InfoInput from "../../../components/Input/InfoInput";
import useChannelInfos from "../../../hooks/Chat/useChannelInfos";
import { useChannels } from "../../../hooks/Chat/useChannels";
import useMembers from "../../../hooks/Chat/useMembers";



function ProtectedChannelPassword(props: any) {

    const { token } = useCurrentUser();
    const [passwordValue, setPasswordValue]: any = useState("");
    const { addChannelProtected } = useChannels();
    const [error, setError] = useState("")

    async function submitPassword() {
        
        if (passwordValue.trim()) {
            await getChannelProtected(props.channel.id, passwordValue.trim(), token)
            .then(res => {
                if (res.data)
                {
                    props.setJoinChannelProtectedView(false);
                    addChannelProtected(props.channel, passwordValue, true );
                    setError("");
                }
                else
                    setError("Wrong password")
            })
        }
    }

    return (
        <ConfirmView>
            <div className="joinchannel-cornfirmview-container flex-column">
                <h3>Channel protected</h3>
                {error && <p className="red-c">{error}</p>}
                <InfoInput
                    id="joinchannel-confirmview"
                    label="Password"
                    value={passwordValue}
                    setValue={setPasswordValue}
                    submit={() => submitPassword()}
                />
            </div>
        </ConfirmView>
    )


}


function ConfirmView({ children }: any) {
    return (
        <div className="absolute fill confirm-background flex-center" >
            {children}
        </div>
    )
}