
import React from "react";
import { getUserByUsername, addUserFriend, getUser } from '../../utils/User'
import { FriendSearch } from "../../components/FriendElement";

import IconInput from "../../components/IconInput";
import { useOutletContext } from "react-router-dom";
import './AddElement.css'


export default function AddElement(props)
{
    const [prevValue, setPrevValue] = React.useState("");
    const [value, setValue] = React.useState("");
    const [friend, setFriend] = React.useState(null);
    const [error, setError] = React.useState(false);

    const {user, updateFriendList, friends} = useOutletContext();


    function validFriend()
    {
        return (friends.every(user => friend.id !== user.id) && friend.id !== user.id)
    }

    function handleResponse(res)
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
            console.log(res)
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
            const res = await addUserFriend(user.id, friend.id);
            updateFriendList(friend);
        }
    }
    
    React.useEffect(() => {
        const reloadFriendInterval = setInterval(updateFriend, 3000);
        return (() => clearInterval(reloadFriendInterval)); 
    }, [friend])

    return (
        <div className="add-container">
            <div className="flex-column-center add-div">
                <h2 className="add-title">Add a {props.title}</h2>
                <IconInput
                        icon="search"
                        placeholder="Username"
                        getValue={v => setValue(v.trim())}
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
            </div>
        </div>
    )
}
