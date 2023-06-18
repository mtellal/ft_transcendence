import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfilePicture, updateUser } from "../../requests/user";

import InfoInput from "../../components/Input/InfoInput";

import { useCurrentUser } from "../../hooks/Hooks";

import './Profile.css'
import { useBlock } from "../../hooks/Chat/useBlock";

function ProfileInfos({ id, updateCurrentUser, ...props }: any) {
    const [username, setUsername]: [string, any] = React.useState(props.username);
    const [error, setError] = React.useState("");
    const [updated, setUpdated] = React.useState(false);
    const prevUsernameRef = useRef(props.username);

    async function updateProfile() {
        setError("");
        setUpdated(false);
        if (!username || !username.trim())
            return setError("Username required and can't be empty");
        if (username.trim().length > 15)
            return setError("Username too long (15 chars max)");
        if (username.trim().match(/[^a-zA-Z0-9 ]/g))
            return setError("Username invalid (only alphanumeric characters)")

        if (prevUsernameRef.current !== username) {
            updateUser({
                username: username,
                userStatus: "ONLINE"
            }, id)
                .then(d => {
                    if (d.status !== 200 || d.statusText !== "OK")
                        throw "";
                    setUpdated(true);
                    updateCurrentUser(d.data);
                })
            prevUsernameRef.current = username;
        }
    }

    return (
        <div className="profileinfos-container">
            <div className="profileinfos-input-container">
                <InfoInput
                    id={props.id}
                    label="Username"
                    value={username}
                    setValue={setUsername}
                    submit={updateProfile}
                />
            </div>
            {error && <p className='profileinfos-error' >{error}</p>}
            {updated && <p className='profileinfos-updated' >Profile updated</p>}
            <button
                onClick={updateProfile}
                className="button"
            >
                Update
            </button>
        </div>
    )
}

/*
    - update user infos with fetch a PATCH/POST method (or any other update html method)
    - handle pp edit, save it in session/local storage and push in database ? or fetch, update database and fetch it again ? 
*/

function ProfilePicture({ token, image, setImage }: any) {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    async function editProfilePicture(e: any) {
        setError("");
        const file = e.target.files[0];
        if (file.type.match("image.*")) {
            let url = window.URL.createObjectURL(e.target.files[0])
            setImage(url);
            const fileRes = await updateProfilePicture(e.target.files[0], token);
            if (fileRes.status !== 201 && fileRes.statusText !== "OK")
                console.log("Error => ", fileRes);
        }
        else
            setError("Wrong format file");
    }

    async function disconnect() {
        navigate("/login");
    }

    return (
        <div className="flex-column-center">
            <div>
                <div className="picture-container">
                    <img className="profile-picture" src={image} />
                </div>
                <form >
                    <label
                        htmlFor="edit"
                        className="profil-picture-label"
                    >
                        Edit
                    </label>
                    <input
                        id="edit"
                        type="file"
                        placeholder="edit"
                        className="profile-picture-input"
                        onChange={editProfilePicture}
                    />
                </form>
            </div>
            {error && <p className="red-c" style={{fontSize: 'small'}} >{error}</p>}
            <button
                className="profile-picture-button"
                onClick={disconnect}
            >
                Disconnect
            </button>
        </div>
    )
}

export default function Profile() {

    const {
        token,
        user,
        updateCurrentUser,
        updateCurrentProfilePicture
    }: any = useCurrentUser();
    const { getblockedUsers } = useBlock();

    const [blockedUsers, setBlockedUsers] = useState([]);

    async function initBlockedUsers() {
        const users = await getblockedUsers();
        console.log(users, user.blockList)
        if (users && users.length)
            setBlockedUsers(users);
    }

    useEffect(() => {
        if (user)
            initBlockedUsers();
    }, [user])

    return (
        <div className="profile">
            <h2>Profile</h2>
            <div className="flex">
                <ProfileInfos
                    id={user.id}
                    username={user.username}
                    updateCurrentUser={updateCurrentUser}
                />
                <ProfilePicture
                    token={token}
                    image={user && user.url}
                    setImage={updateCurrentProfilePicture}
                />
            </div>
        </div>
    )
}

