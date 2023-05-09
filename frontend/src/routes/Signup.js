import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import IconInput from "../components/IconInput";
import imgLogin from '../assets/icon-login.png'
import { signupRequest } from "../utils/User";
import { setCookie } from "../utils/Cookie";

import '../styles/Sign.css'


export default function SignUp()
{
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [error, setError] = React.useState(false);

    const navigate = useNavigate();

    async function handleSubmit() {
        if (!username || !password || !confirmPassword)
            return (setError("userame or password empty"));
        if (password !== confirmPassword)
            return (setError("password !== confirm password"))
        const res = await signupRequest(username, password);
        // console.log(res);
        if (res && res.status === 201 && res.statusText === "Created")
        {
            setCookie("access_token", res.data.access_token);
            navigate("/signin");
        }
        else
            setError(`${res.response.status} ${res.response.statusText}`);
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
                    submit={handleSubmit}
                    />
                <IconInput
                    icon="lock"
                    placeholder="Password"
                    getValue={value => setPassword(value)}
                    submit={handleSubmit}
                    />
                <IconInput
                    icon="lock"
                    placeholder="Confirm password"
                    getValue={value => setConfirmPassword(value)}
                    submit={handleSubmit}
                    />
                {error && <p>error: {error}</p>}
                <button 
                    className="sign--button" 
                    onClick={handleSubmit} 
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