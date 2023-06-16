
import React, { useCallback, useEffect, useState } from "react";
import {
    sendFriendRequest,
    validFriendRequest,
    refuseFriendRequest,
} from '../../../requests/friendsRequest'

import {
    getUser,
    getUserByUsername,
} from '../../../requests/user'

import { UserLabelSearch } from "../../../components/users/UserLabel";

import IconInput from "../../../components/Input/IconInput";
import { CollectionElement } from "../components/Menu/MenuElement";

import { useFriendsContext, useCurrentUser } from "../../../hooks/Hooks";

import './AddFriend.css'
import ArrowBackMenu from "../components/ArrowBackMenu";
import { useWindow } from "../../../hooks/useWindow";
import useFetchUsers from "../../../hooks/useFetchUsers";
import { useFriends } from "../../../hooks/Chat/Friends/useFriends";
import { useFriendRequest } from "../../../hooks/Chat/Friends/useFriendRequest";
import { getWhisperChannel } from "../../../requests/chat";
import { useChannels } from "../../../hooks/Chat/useChannels";


export default function AddFriend() {

    const { isMobileDisplay } = useWindow();
    const { sendRequest, validFriend } = useFriendRequest();

    const [value, setValue] = useState("");
    const [error, setError] = useState(false);
    const [prevValue, setPrevValue] = useState("");
    const [friend, setFriend]: [any, any] = useState(null);


    async function searchUser() {
        if (prevValue === value)
            return;
        await getUserByUsername(value)
            .then(res => {
                if (res.status === 200 && res.statusText === "OK") {
                    setFriend(res.data);
                    setError(false)
                }
                else {
                    setFriend(null);
                    setError(true)
                }
            })
        setPrevValue(value);
    }


    return (
        <div className="add-container">
            <div className="flex">
                {
                    isMobileDisplay &&
                    <div className="flex">
                        <ArrowBackMenu
                            title="Menu"
                            path="/chat"
                        />
                    </div>
                }
            </div>
            <div className="flex-column-center">
                <h2>Add a Friend</h2>
                <IconInput
                    id="Friend"
                    icon="search"
                    placeholder="Username"
                    value={value}
                    setValue={setValue}
                    submit={() => { value && searchUser() }}
                />
                {
                    friend ?
                        <div className="user-found">
                            <UserLabelSearch
                                key={friend.id}
                                id={friend.id}
                                username={friend.username}
                                profilePictureURL={friend.avatar}
                                userStatus={friend.userStatus}
                                onClick={() => sendRequest(friend)}
                                add={validFriend(friend)}
                            />
                        </div>
                        : null
                }
                {
                    error ? <p>User not found</p> : null
                }
                <button
                    className="add-button button"
                    onClick={searchUser}
                >
                    Search
                </button>
                <FriendRequests />
            </div>
        </div>
    )
}

export function FriendRequests() {

    const { fetchUsers } = useFetchUsers();
    const { friendInvitations } = useFriendsContext();
    const { acceptFriend, refuseFriend } = useFriendRequest();

    const [userInvitations, setUserInvitations]: [any, any] = useState([]);
    const [invitations, setInvitations]: [any, any] = useState([]);

    const loadInvitations = useCallback(async () => {
        const users = await fetchUsers(friendInvitations.map((r: any) => r.sendBy));
        if (users && users.length)
            setUserInvitations(users);
    }, [friendInvitations])


    React.useEffect(() => {
        if (friendInvitations && friendInvitations.length) {
            loadInvitations();
        }
        else {
            setInvitations([]);
            setUserInvitations([]);
        }
    }, [friendInvitations])


    React.useEffect(() => {
        if (userInvitations && userInvitations.length) {
            setInvitations(userInvitations.map((u: any) =>
                <UserLabelSearch
                    key={u.id}
                    id={u.id}
                    username={u.username}
                    profilePictureURL={u.avatar}
                    userStatus={u.userStatus}
                    invitation={true}
                    accept={() => acceptFriend(u)}
                    refuse={() => refuseFriend(u)}
                />
            ))
        }
        else
            setInvitations([]);
    }, [userInvitations])


    return (
        <>
            {
                userInvitations.length ?
                    <CollectionElement
                        title="Invitations"
                        collection={invitations}
                    />
                    :
                    null
            }
        </>
    )
}