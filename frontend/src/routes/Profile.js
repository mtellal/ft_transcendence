import React from "react";

import '../styles/Profile.css'

import jwtDecode from 'jwt-decode';
import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import { getUser, updateUser } from "../utils/User";
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


function ProfileInfos(props)
{
    const [username, setUsername] = React.useState(props.username || "");
    const [password, setPassword] = React.useState(props.password || "");
    const [email, setEmail] = React.useState(props.email || "");
    
    
    async function updateProfile()
    {
        const res = await updateUser({
            username: username || props.username, 
            password: password || props.password, 
            avatar: props.avatar || "", 
            userStatus: "ONLINE"
        }, props.id)
        console.log(res)
        console.log("ProfileInfos: profile updated");
    }

    return (
        <div className="form--container">
            <InfoInput 
                id={Math.floor(Math.random() * 1000000)}
                label="Username"
                value={props.username}
                getValue={setUsername}
            />
            <InfoInput 
                id={Math.floor(Math.random() * 1000000)}
                label="Password"
                value={props.password}
                getValue={setPassword}
            />  
            <InfoInput 
                id={Math.floor(Math.random() * 1000000)}
                label="Email"
                value={props.email}
                getValue={setEmail}
            /> 

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

function ProfilePicture({image, ...props})
{
    const [img, setImg] = React.useState(image);

    const navigate = useNavigate();

    function editProfilePicture(e)
    {
        console.log(e.target.files[0])
        setImg(URL.createObjectURL(e.target.files[0]));
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
    if (user && user.data && user.status === 200 && user.statusText === "OK")
        return (user.data);
    else 
        return (null)
}

export default function Profile()
{
    const user = useLoaderData();
    console.log("Profile loader datas => ", user)

    return (
        <div className="profile">
            <ProfileInfos 
                id={user && user.id}
                username={user && user.username} 
                password={user && user.password} 
                email={user && user.email}
            />
            <ProfilePicture 
                image="./assets/user.png"
            />              
        </div>
    )
}