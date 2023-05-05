import React from "react";

import '../styles/Profile.css'

import jwtDecode from 'jwt-decode';
import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import { getUser, getUserProfilePictrue, updateProfilePicture, updateUser } from "../utils/User";
import { extractCookie } from "../utils/Cookie";



function InfoInput(props)
{
    const [value, setValue] = React.useState(props.value || "");

    function onChange(e)
    {
        setValue(e.target.value);
        if (e.target.value)
        {
            props.getValue(e.target.value);
        }
    }

    return (
        <div className="input--container">
            <label htmlFor={props.id} className="input--label" >{props.label}</label>
            <input
                id={props.id}
                className="input"
                placeholder={props.label}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}


function ProfileInfos({user, ...props})
{
    const [username, setUsername] = React.useState(props.username || "");
    const [error, setError] = React.useState("");
    
    async function updateProfile()
    {
        const res = await updateUser({
            username: username || props.username, 
            avatar: user.avatar,
            userStatus: "ONLINE"
        }, props.id)

        if (res && res.status !== 200 && res.statusText !== "OK")
        {
            setError("Username invalid")
            console.log("updateProfile failed");
        }
        else
        {
            setError("")
            console.log("updateProfile succeed")
        }
    }

    return (
        <div className="form--container">
            <InfoInput 
                id={Math.floor(Math.random() * 1000000)}
                label="Username"
                value={props.username}
                getValue={setUsername}
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

    const navigate = useNavigate();

    async function editProfilePicture(e)
    {
        /* const userResponse = await updateUser({...user, avatar: e.target.files[0].name}, user.id)
        if (userResponse.status !== 200 && userResponse.statusText !== "OK")
            console.log("Error => ", userResponse); */

        const file = await updateProfilePicture(e.target.files[0], token);
        if (file.status !== 201 && file.statusText !== "OK")
            console.log("Error => ", file);
    }

    function disconnect()
    {
        navigate("/signin");
    }

    return (
        <div className="profile-picture-container">
            <img className="profile-picture" src={img} />
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

export async function loader()
{
    const token = extractCookie("access_token");
    let id = jwtDecode(token).sub;
    const user = await getUser(id);

    let image = await getUserProfilePictrue(id);
    if (image.status === 200 && image.statusText === "OK")
        image =  window.URL.createObjectURL(new Blob([image.data]))
    else
        image = "";
    if (user && user.data && user.status === 200 && user.statusText === "OK")
        return ([user.data, token, image]);
    else 
        return (null)
}

export default function Profile()
{
    const [user, token, image] = useLoaderData();
    console.log(user, image)


    return (
        <div className="profile">
            <ProfileInfos 
                id={user && user.id}
                username={user && user.username} 
                password={user && user.password} 
            />
            <ProfilePicture 
                user={user}
                image={image  || "./assets/user.png"}
                token={token}
            />              
        </div>
    )
}