import React from "react";

import '../styles/Profile.css'

import imgProfile from '../images/user.png'
import jwt_decode from 'jwt-decode';
import { redirect, useLoaderData } from "react-router-dom";



function InfoInput(props)
{
    const [value, setValue] = React.useState(props.value || "");

    return (
        <div className="input--container">
            <label htmlFor={props.id} className="input--label" >{props.label}</label>
            <input
                id={props.id}
                className="input"
                placeholder={props.label}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    )
}


function ProfileInfos(props)
{
    
    function updateProfile()
    {
        console.log("ProfileInfos: profile updated");
    }

    return (
        <div className="form--container">
            <InfoInput 
                id={Math.floor(Math.random() * 1000000)}
                label="Username"
                value={props.username}
            />
            <InfoInput 
                id={Math.floor(Math.random() * 1000000)}
                label="Password"
                value={props.password}
            />  
            <InfoInput 
                id={Math.floor(Math.random() * 1000000)}
                label="Email"
                value={props.email}
            /> 

            <button onClick={updateProfile} className="profile-infos-button" >Update</button>         
        </div>
    )
}

/*
    - update user infos with fetch a PATCH/POST method (or any other update html method)
    - handle pp edit, save it in session/local storage and push in database ? or fetch, update database and fetch it again ? 
*/

function ProfilePicture()
{
    const [img, setImg] = React.useState(imgProfile);

    function editProfilePicture(e)
    {
        setImg(URL.createObjectURL(e.target.files[0]));
    }

    function disconnect()
    {
        console.log("ProfilePicture: disconnection")
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
    const obj = jwt_decode(document.cookie);
    console.log("ici", process.env.REACT_APP_BACK)

    return (fetch(`${process.env.REACT_APP_BACK}/users/${obj.sub}`, {
            headers: {
                'Authorization':`Bearer ${document.cookie.split("=")[1]}`
            }
        })
        .then(res => {
            if (!res.ok)
                return (redirect("/signin"));
            console.log(res);
            return res.json();
        })
        .then(data =>  data)
        .catch(err => console.log(err))
    )
}


export default function Profile()
{
    const loader = useLoaderData();
    console.log("Profile loader datas => ", loader)

    return (
        <div className="profile">
            <ProfileInfos 
                username={loader && loader.username} 
                password={loader && loader.password} 
                email={loader && loader.email}
            />
            <ProfilePicture />              
        </div>
    )
}