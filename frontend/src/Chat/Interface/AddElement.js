
import React from "react";
import { getUserByUsername } from '../../utils/User'
import FriendElement from "../../components/FriendElement";

import './AddElement.css'
import IconInput from "../../components/IconInput";


export default function AddElement(props)
{
    const [prevValue, setPrevValue] = React.useState("");
    const [value, setValue] = React.useState("");
    const [friend, setFriend] = React.useState(null);
    const [error, setError] = React.useState(false);

    async function searchUser()
    {
        if (prevValue === value)
            return ;
        const res = await getUserByUsername(value);
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
        setPrevValue(value);
    }

    function handleSubmit()
    {
        if (value)
        {
            searchUser();
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
                        <FriendElement 
                            key={friend.id}
                            id={friend.id}
                            username={friend.username}
                            avatar={friend.avatar}
                            userStatus={friend.userStatus}
                            hover={true}
                            selected={false}
                            addUser={true}
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
