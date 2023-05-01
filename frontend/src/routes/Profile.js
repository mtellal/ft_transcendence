import React from "react";

import '../styles/Profile.css'


import imgProfile from '../images/user.png'


function InfoInput(props)
{
    const [value, setValue] = React.useState("");

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

            />
            <InfoInput 
                id={Math.floor(Math.random() * 1000000)}
                label="Password"

            />  
            <InfoInput 
                id={Math.floor(Math.random() * 1000000)}
                label="Phone number"

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

export default function Profile(props)
{
    return (
        <div className="profile">
            <ProfileInfos />
            <ProfilePicture />              
        </div>
    )
}