
import React from "react";
import { getUserByUsername, addUserFriend, getUser, sendFriendRequest, validFriendRequest, refuseFriendRequest } from '../../utils/User'
import { FriendSearch } from "../../Components/FriendElement";

import IconInput from "../../Components/IconInput";
import { useOutletContext } from "react-router-dom";
import { CollectionElement } from "../MenuElement";

import './AddElement.css'

export default function AddElement(props : any)
{
    const [prevValue, setPrevValue] = React.useState("");
    const [value, setValue] = React.useState("");
    const [friend, setFriend] : [any, any] = React.useState(null);
    const [error, setError] = React.useState(false);

    const [userInvitations, setUserInvitations] : [any, any] = React.useState([]);
    const [invitations, setInvitations] : [any, any] = React.useState([]);

    const {
        user, 
        updateFriendList, 
        friends, 
        token,
        friendInvitations,
        removeFriendRequest
    } : any = useOutletContext();

    function validFriend()
    {
        return (friends.every((user : any) => friend.id !== user.id) && friend.id !== user.id)
    }

    function handleResponse(res : any)
    {
        if (res.status === 200 && res.statusText === "OK")
        {
            setFriend(res.data);
            setError(false)
        }
        else
        {
            setFriend(null);
            setError(true)
        }
    }

    async function searchUser()
    {
        if (prevValue === value)
            return ;
        const res = await getUserByUsername(value);
        handleResponse(res);
        setPrevValue(value);
    }

    async function updateFriend()
    {
        if (friend)
        {
            const res = await getUser(friend.id);
            handleResponse(res)
        }
    }
    
    async function addFriend()
    {
        if (validFriend())
        {
            const sendRes = await sendFriendRequest(friend.id, token);
        }
    }
    
    React.useEffect(() => {
        const reloadFriendInterval = setInterval(updateFriend, 3000);
        return (() => clearInterval(reloadFriendInterval)); 
    }, [friend])


    async function loadUser(id : number | string)
    {
        const userRes = await getUser(id);
        if (userRes.status === 200 && userRes.statusText === "OK")
        {
            return (userRes.data);
        }
        return (null)
    }

    async function acceptFriendRequest(u : any)
    {
        const invitation = friendInvitations.find((i : any) => i.sendBy === u.id);
        if (invitation)
        {
            const validRes = await validFriendRequest(invitation.id, token);
            if (validRes.status === 201 && validRes.statusText === "Created")
            {
                updateFriendList(u);
                removeFriendRequest(invitation.id);
                setUserInvitations((p : any) => p.filter((user : any) => user.id !== u.id))
            }
        }
    }

    async function refuseRequest(u : any)
    {
        const invitation = friendInvitations.find((i : any) => i.sendBy === u.id);
        if (invitation)
        {
            const refuseRes = await refuseFriendRequest(invitation.id, token);
            if (refuseRes.status === 200 && refuseRes.statusText === "OK")
            {
                removeFriendRequest(invitation.id);
                setUserInvitations((p : any) => p.filter((user : any) => user.id !== u.id))
            }
        }
    }


    async function loadFriends()
    {
        const users = await Promise.all(friendInvitations.map(async (u : any) =>
            await loadUser(u.sendBy)
        ))
        setUserInvitations(users);
    } 

    React.useEffect(() => {

        if (friendInvitations && friendInvitations.length)
        {
            loadFriends();
        }
        else
        {
            setInvitations([]);
            setUserInvitations([]);
        }
    }, [friendInvitations])


    React.useEffect(() => {
        if (userInvitations && userInvitations.length)
        {
            setInvitations(userInvitations.map((u : any) => 
                <FriendSearch
                    key={u.id}
                    id={u.id}
                    username={u.username}
                    avatar={u.avatar}
                    userStatus={u.userStatus}
                    invitation={true}
                    accept={() => acceptFriendRequest(u)}
                    refuse={() => refuseRequest(u)}
                />
            ))
        }
        else
            setInvitations([]);
    }, [userInvitations])


    return (
        <div className="add-container">
            <div className="flex-column-center add-div">
                <h2 className="add-title">Add a {props.title}</h2>
                <IconInput
                        icon="search"
                        placeholder="Username"
                        getValue={(v : string) => setValue(v.trim())}
                        submit={() => value && searchUser()}
                    />
                {
                    friend ? 
                    <div className="user-found">
                        <FriendSearch
                            key={friend.id}
                            id={friend.id}
                            username={friend.username}
                            avatar={friend.avatar}
                            userStatus={friend.userStatus}
                            onCLick={() => addFriend()}
                            add={validFriend()}
                        />
                    </div>
                        : null
                }
                {
                    error ? <p>User not found</p> : null
                }
                <button 
                    className="add-button"
                    onClick={searchUser}
                >
                    Search
                </button>
                {
                    userInvitations.length ?
                        <div className="add-element-invitations">
                            <CollectionElement
                                title="Invitations"
                                collection={invitations}
                                addClick={props.addGroup}
                            />
                        </div> 
                    : 
                        null
                }
            </div>
        </div>
    )
}
