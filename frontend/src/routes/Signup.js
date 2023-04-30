import React from "react";
import { Link, Outlet } from "react-router-dom";

import '../styles/Sign.css'
import IconInput from "../components/IconInput";
import imgLogin from '../images/icon-login.png'

export default function SignUp(props)
{

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [formError, setFormError] = React.useState(false);

    function submitForm()
    {
        if (!username || !password || !confirmPassword)
            console.log("Error field")
        else if (password !== confirmPassword)
            console.log("Error password !== confirm password")
        else
        {
            console.log("User Created")
        }
    }

    return (
        <>
        <div className="sign-page">
            <div className="sign-form">
                <img src={imgLogin} className="sign--img" />
                <IconInput
                    icon="person"
                    placeholder="Username"
                    getValue={value => setUsername(value)}
                    />
                <IconInput
                    icon="lock"
                    placeholder="Password"
                    getValue={value => setPassword(value)}
                    />
                <IconInput
                    icon="lock"
                    placeholder="Confirm password"
                    getValue={value => setConfirmPassword(value)}
                    />
                <button 
                    className="sign--button" 
                    onClick={submitForm} 
                    >
                    Sign up
                </button>
                <Link
                    to={"/signin"}
                    className="sign--link"
                    >
                    Sign in
                </Link>
            </div>
        </div>
        <Outlet />
        </>
    )
}