import React, { useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { updateProfilePicture, updateUser } from "../utils/User";

import InfoInput from "../Components/InfoInput";

import './Profile.css'

function ProfileInfos({ password, updateHeader, ...props } : any) {
    const [username, setUsername] = React.useState(props.username);
    const [error, setError] = React.useState("");
    const [updated, setUpdated] = React.useState(false);

    async function updateProfile() {
        const res = await updateUser({
            username: username,
            userStatus: "ONLINE"
        }, props.id)

        if (res && res.status !== 200 && res.statusText !== "OK") {
            setError("Username invalid")
            setUpdated(false)
        }
        else if (username !== props.username) {
            setError("")
            updateHeader(username);
            setUpdated(true);
        }
    }

    return (
        <div className="form--container">
            <InfoInput
                id={props.id}
                label="Username"
                value={username}
                getValue={setUsername}
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

function ProfilePicture({ image, token, updateHeader } : any ) {
    const navigate = useNavigate();
    const [img, setImg] = React.useState(image);

    async function editProfilePicture(e : any) {
        const file = e.target.files[0];
        if (file.type.match("image.*")) {
            let url = window.URL.createObjectURL(e.target.files[0])
            setImg(url);
            updateHeader(url);
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
                <img className="profile-picture" src={img} />
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
        user,
        token,
        image,
        updateHeaderUsername,
        updateHeaderProfilePicture,
    } : any = useOutletContext();

    return (
        <div className="profile">
            <ProfileInfos
                id={user && user.id}
                username={user && user.username}
                password={user && user.password}
                updateHeader={updateHeaderUsername}
            />
            <ProfilePicture
                image={image || "./assets/user.png"}
                token={token}
                updateHeader={updateHeaderProfilePicture}
            />
        </div>
    )
}