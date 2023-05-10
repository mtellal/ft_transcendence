
import React from "react";
import { getUserByUsername, addUserFriend } from '../../utils/User'
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

    const {user, updateFriendList} = useOutletContext();

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
            const res = await getUserByUsername(friend.username);
            handleResponse(res)
        }
    }

    function handleSubmit()
    {
        if (value)
        {
            searchUser();
        }
    }
    
    React.useEffect(() => {
        const reloadFriendInterval = setInterval(updateFriend, 3000);
        return (() => clearInterval(reloadFriendInterval)); 
    }, [friend])

    async function addFriend()
    {
        if (user.friendList.find(id => friend.id !== id))
        {
            const res = await addUserFriend(user.id, friend.id);
            updateFriendList();
            console.log("add friend")
        }
    }

    return (
        <div className="add-container">
            <div className="add-div">
                <h2 className="add-title">Add a {props.title}</h2>
                <IconInput
                        icon="search"
                        placeholder="Username"
                        getValue={v => setValue(v)}
                        submit={() => handleSubmit()}
                    />
                {
                    friend ? 
                    <div className="user-found">
                        <FriendSearch
                            key={friend.id}
                            id={friend.id}
                            username={friend.username}
                            userStatus={friend.userStatus}
                            onCLick={() => addFriend()}
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
