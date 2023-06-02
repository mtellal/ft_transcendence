import React, { useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { updateProfilePicture, updateUser } from "../../utils/User";

import InfoInput from "../../components/Input/InfoInput";

import { useCurrentUser } from "../../Hooks";

import './Profile.css'

function ProfileInfos({id, updateCurrentUser, ...props } : any) {
    const [username, setUsername] : [string, any] = React.useState(props.username);
    const [error, setError] = React.useState("");
    const [updated, setUpdated] = React.useState(false);

    async function updateProfile() {
        updateUser({
            username: username,
            userStatus: "ONLINE"
        }, id)
        .then(d => {
            if (d.status !== 200 || d.statusText !== "OK")
                throw "";
            if  (username === props.username)
                    throw "Already yours";
            setError("");
            setUpdated(true);
            updateCurrentUser(d.data);
        })
        .catch(e => {
            if (e === "Already yours")
                setError("Already yours")
            else
                setError("Username invalid");
            setUpdated(false);
        })
    }

    return (
        <div className="form--container">
            <InfoInput
                id={props.id}
                label="Username"
                value={username}
                setValue={setUsername}
                submit={updateProfile}
            />
            {error && <p className='infos-error' >{error}</p>}
            {updated && <p className='infos-updated' >Profile updated</p>}
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

function ProfilePicture({token, image, setImage} : any) {
    const navigate = useNavigate();

    async function editProfilePicture(e : any) {
        const file = e.target.files[0];
        if (file.type.match("image.*")) {
            let url = window.URL.createObjectURL(e.target.files[0])
            setImage(url);
            const fileRes = await updateProfilePicture(e.target.files[0], token);
            if (fileRes.status !== 201 && fileRes.statusText !== "OK")
                console.log("Error => ", fileRes);
        }
        else
            console.log("Wrong format file")
    }

    async function disconnect() {
        navigate("/login");
    }

    return (
        <div className="profile-picture-container">
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
    } : any = useCurrentUser();

    return (
        <div className="profile">
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
    )
}