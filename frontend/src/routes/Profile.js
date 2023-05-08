import React, { useContext } from "react";

import '../styles/Profile.css'

import jwtDecode from 'jwt-decode';
import { redirect, useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import { getUser, getUserProfilePictrue, updateProfilePicture, updateUser } from "../utils/User";
import { extractCookie } from "../utils/Cookie";
import { UserContext } from "../App";



function InfoInput(props)
{
    const inputRef = React.useRef();
    const [value, setValue] = React.useState(props.value || "");

    function onChange(e)
    {
        setValue(e.target.value);
        if (e.target.value)
        {
            props.getValue(e.target.value);
        }
    }

    function handleKeyDown(e)
    {
        if (e.key === 'Enter' && value)
        {
            props.submit()
            inputRef.current.blur();
        }
    }

    return (
        <div className="input--container">
            <label htmlFor={props.id} className="input--label" >{props.label}</label>
            <input
                ref={inputRef}
                id={props.id}
                className="input"
                placeholder={props.label}
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    )
}


function ProfileInfos({user, ...props})
{
    const [username, setUsername] = React.useState(props.username || "");
    const [error, setError] = React.useState("");
    const {pp, updateHeaderUsername} = useOutletContext();

    async function updateProfile()
    {
        const res = await updateUser({
            username: username, 
            avatar: props.avatar || "",
            userStatus: "ONLINE"
        }, props.id)

        if (res && res.status !== 200 && res.statusText !== "OK")
        {
            setError("Username invalid")
            console.log("updateProfile failed", res);
        }
        else
        {
            setError("")
            console.log("updateProfile succeed")
            updateHeaderUsername(username);
        }
    }

    return (
        <div className="form--container">
            <InfoInput 
                id={Math.floor(Math.random() * 1000000)}
                label="Username"
                value={props.username}
                getValue={setUsername}
                submit={updateProfile}
            />
            {error && <p style={{color:'red'}}>{error}</p>}
            <button 
                onClick={updateProfile} 
                className="profile-infos-button" 
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

function ProfilePicture({user, image, token, ...props})
{
    const [img, setImg] = React.useState(image);
    const {updateHeaderProfilePicture} = useOutletContext();

    const navigate = useNavigate();

    async function editProfilePicture(e)
    {
        const file = e.target.files[0];
        if (file.type.match("image.*"))
        {
            let url = window.URL.createObjectURL(e.target.files[0])
            setImg(url);
            updateHeaderProfilePicture(url);
            const fileRes = await updateProfilePicture(e.target.files[0], token);
            if (fileRes.status !== 201 && fileRes.statusText !== "OK")
                console.log("Error => ", fileRes);
        }
        else
            console.log("Wrong format file")
    }

    function disconnect()
    {
        navigate("/signin");
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

export default function Profile()
{
    const [user, token, image] = useContext(UserContext);

    return (
        <div className="profile">
            <ProfileInfos 
                id={user && user.id}
                username={user && user.username} 
                password={user && user.password} 
                avatar={user && user.avatar}
            />
            <ProfilePicture 
                user={user}
                image={image  || "./assets/user.png"}
                token={token}
            />              
        </div>
    )
}