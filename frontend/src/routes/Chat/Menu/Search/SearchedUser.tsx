import React, { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlock } from "../../../../hooks/Chat/useBlock";
import { useFriends } from "../../../../hooks/Chat/Friends/useFriends";
import { useCurrentUser } from "../../../../hooks/Hooks";
import { useChannels } from "../../../../hooks/Chat/useChannels";
import { useFriendRequest } from "../../../../hooks/Chat/Friends/useFriendRequest";
import { createChannel } from "../../../../requests/chat";
import { User } from "../../../../types";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { UserInfos } from "../../../../components/users/UserInfos";
import Icon from "../../../../components/Icon";


import moreVertical from '../../../../assets/moreVertical.svg'


import './SearchedUser.css';

function SearchedUserAddRemove(props: any) {

    const { isUserFriend, removeFriend } = useFriends();
    const { sendRequest } = useFriendRequest();

    return (
        <>
            {
                isUserFriend(props.user) ?
                    <p
                        className="searcheduser-action"
                        onClick={() => removeFriend(props.user, true)}
                    >
                        remove
                    </p>
                    :
                    <p
                        className="searcheduser-action"
                        onClick={() => sendRequest(props.user)}
                    >
                        add
                    </p>
            }
        </>
    )
}


function SearchedUserBlock(props: any) {
    const { blockUser, unblockUser, isUserBlocked } = useBlock();

    return (
        <>
            {
                isUserBlocked(props.user) ?
                    <p
                        className="searcheduser-action"
                        onClick={() => unblockUser(props.user)}
                    >
                        unblock
                    </p>
                    :
                    <p
                        className="searcheduser-action"
                        onClick={() => blockUser(props.user)}
                    >
                        block
                    </p>
            }
        </>
    )
}


function SearchedUserActions(props: any) {

    const navigate = useNavigate();

    const { token } = useCurrentUser();
    const { addChannel, selectWhisperChannel } = useChannels();


    const selectOrCreateChannel = useCallback(async () => {
        let channel = await selectWhisperChannel(props.user);
        if (!channel) {
            await createChannel({
                name: "privateMessage",
                type: "WHISPER",
                members: [
                    props.user.id
                ],
            }, token)
                .then(res => { channel = res.data })
        }
        await addChannel(channel, false);
    }, [token]);

    return (
        <div
            className="absolute searcheduser-actions"
            style={props.showActions ? { visibility: 'visible' } : { visibility: 'hidden' }}
            onClick={() => props.setShowActions((p: boolean) => !p)}
        >
            <SearchedUserAddRemove {...props} />

            <p
                className="searcheduser-action"
                onClick={async () => {
                    selectOrCreateChannel();
                    navigate(`/chat/user/${props.user.id}`);
                    props.resetInput();
                }}
            >
                message
            </p>
            <SearchedUserBlock {...props} />
        </div>
    )
}



type TUserProps = {
    user: User,
    resetInput?: () => void
}

export function SearchedUser(props: TUserProps) {

    const [showActions, setShowActions] = useState(false);
    const ref = useOutsideClick(() => setShowActions(false))

    const { user } = useCurrentUser();

    return (
        <div className='flex-ai searcheduser' >
            <UserInfos user={props.user} />
            <div ref={ref} className="relative searcheduser-icon" >
                {
                    props.user && props.user.id && user && props.user.id !== user.id &&
                    <Icon icon={moreVertical} onClick={() => setShowActions((p: boolean) => !p)} />
                }
                <SearchedUserActions {...props} showActions={showActions} setShowActions={setShowActions} />
            </div>
        </div >
    )
}